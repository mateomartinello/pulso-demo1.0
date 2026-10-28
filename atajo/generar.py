# Genera el atajo «Pulso Salud» (plist XML) para firmarlo con `shortcuts sign`.
# Flujo: si recibe un código (Pulso lo abre con shortcuts://run-shortcut?...&input=text&text=CODIGO) lo guarda en
# Atajos/pulso-codigo.txt; después lee ese archivo, busca en Salud los pasos y los minutos de ejercicio de hoy y el
# inicio del último período, y los manda a Supabase (rpc/salud_importar).
import plistlib, sys, uuid

CLAVE = "sb_publishable_4rprl49Z0iCw1uuv0Bk6Tw_7-bdMaTb"
URL = "https://aihixquihhpirxmjhumg.supabase.co/rest/v1/rpc/salud_importar"
ARCHIVO = "pulso-codigo.txt"
U = lambda: str(uuid.uuid4()).upper()
OBJ = "￼"

def accion(ident, **p): return {"WFWorkflowActionIdentifier": ident, "WFWorkflowActionParameters": p}
def salida(uid, nombre, aggr=None):
    v = {"OutputUUID": uid, "OutputName": nombre, "Type": "ActionOutput"}
    if aggr: v["Aggrandizements"] = aggr
    return v
def adjunto(v): return {"Value": v, "WFSerializationType": "WFTextTokenAttachment"}
def texto_con(v): return {"Value": {"attachmentsByRange": {"{0, 1}": v}, "string": OBJ}, "WFSerializationType": "WFTextTokenString"}
def texto(s): return {"Value": {"string": s}, "WFSerializationType": "WFTextTokenString"}
def campos(items): return {"Value": {"WFDictionaryFieldValueItems": items}, "WFSerializationType": "WFDictionaryFieldValue"}
def item(k, valor, tipo=0): return {"WFItemType": tipo, "WFKey": texto(k), "WFValue": valor}
ENTRADA = {"Type": "ExtensionInput"}

def filtro(tipo, hoy):
    filas = [{"Bounded": True, "Operator": 4, "Property": "Type", "Removable": False,
              "Values": {"Enumeration": {"Value": tipo, "WFSerializationType": "WFStringSubstitutableState"}}}]
    if hoy:
        filas.append({"Bounded": True, "Operator": 1002, "Property": "Start Date", "Removable": False,
                      "Values": {"Number": "7", "Unit": 16}})
    return {"Value": {"WFActionParameterFilterPrefix": 1, "WFContentPredicateBoundedDate": False,
                      "WFActionParameterFilterTemplates": filas}, "WFSerializationType": "WFContentPredicateTableTemplate"}

a = []
g1 = U()
a.append(accion("is.workflow.actions.conditional", GroupingIdentifier=g1, WFControlFlowMode=0, WFCondition=100,
                WFInput={"Type": "Variable", "Variable": adjunto(ENTRADA)}))
a.append(accion("is.workflow.actions.documentpicker.save", UUID=U(), WFInput=adjunto(ENTRADA), WFAskWhereToSave=False,
                WFFileDestinationPath=ARCHIVO, WFSaveFileOverwrite=True))
a.append(accion("is.workflow.actions.conditional", GroupingIdentifier=g1, WFControlFlowMode=2))
u_cod = U()
a.append(accion("is.workflow.actions.documentpicker.open", UUID=u_cod, WFGetFilePath=ARCHIVO, WFFileErrorIfNotFound=True))
u_pasos, u_spasos = U(), U()
a.append(accion("is.workflow.actions.filter.health.quantity", UUID=u_pasos, WFContentItemFilter=filtro("Steps", True)))
a.append(accion("is.workflow.actions.statistics", UUID=u_spasos, WFStatisticsOperation="Sum",
                Input=adjunto(salida(u_pasos, "Health Samples"))))
u_ej, u_sej = U(), U()
a.append(accion("is.workflow.actions.filter.health.quantity", UUID=u_ej, WFContentItemFilter=filtro("Exercise Minutes", True)))
a.append(accion("is.workflow.actions.statistics", UUID=u_sej, WFStatisticsOperation="Sum",
                Input=adjunto(salida(u_ej, "Health Samples"))))
u_mf, u_per, g2 = U(), U(), U()
a.append(accion("is.workflow.actions.filter.health.quantity", UUID=u_mf, WFContentItemFilter=filtro("Menstrual Flow", False),
                WFContentItemSortProperty="Start Date", WFContentItemSortOrder="Latest First",
                WFContentItemLimitEnabled=True, WFContentItemLimitNumber=1))
a.append(accion("is.workflow.actions.conditional", GroupingIdentifier=g2, WFControlFlowMode=0, WFCondition=100,
                WFInput={"Type": "Variable", "Variable": adjunto(salida(u_mf, "Health Samples"))}))
a.append(accion("is.workflow.actions.format.date", UUID=u_per, WFDateFormatStyle="Custom", WFDateFormat="Custom",
                WFDateFormatString="yyyy-MM-dd",
                WFDate=texto_con(salida(u_mf, "Health Samples", [{"PropertyName": "Start Date", "Type": "WFPropertyVariableAggrandizement"}]))))
a.append(accion("is.workflow.actions.conditional", GroupingIdentifier=g2, WFControlFlowMode=2))
u_hoy = U()
a.append(accion("is.workflow.actions.format.date", UUID=u_hoy, WFDateFormatStyle="Custom", WFDateFormat="Custom",
                WFDateFormatString="yyyy-MM-dd", WFDate=texto_con({"Type": "CurrentDate"})))
u_url = U()
a.append(accion("is.workflow.actions.downloadurl", UUID=u_url, WFURL=URL, WFHTTPMethod="POST", WFHTTPBodyType="JSON", ShowHeaders=True,
                WFHTTPHeaders=campos([item("apikey", texto(CLAVE)), item("Authorization", texto("Bearer " + CLAVE)),
                                      item("Content-Type", texto("application/json"))]),
                WFJSONValues=campos([item("p_codigo", texto_con(salida(u_cod, "File"))),
                                     item("p_fecha", texto_con(salida(u_hoy, "Formatted Date"))),
                                     item("p_pasos", texto_con(salida(u_spasos, "Statistics")), 1),
                                     item("p_minutos", texto_con(salida(u_sej, "Statistics")), 1),
                                     item("p_periodo", texto_con(salida(u_per, "Formatted Date")))])))
a.append(accion("is.workflow.actions.showresult", Text=texto_con(salida(u_url, "Contents of URL"))))

plist = {
    "WFWorkflowActions": a,
    "WFWorkflowClientVersion": "2700.0.4", "WFWorkflowMinimumClientVersion": 900, "WFWorkflowMinimumClientVersionString": "900",
    "WFWorkflowIcon": {"WFWorkflowIconGlyphNumber": 61440, "WFWorkflowIconStartColor": 4282601983},
    "WFWorkflowName": "Pulso Salud",
    "WFWorkflowHasOutputFallback": False, "WFWorkflowImportQuestions": [], "WFWorkflowOutputContentItemClasses": [],
    "WFWorkflowTypes": [], "WFWorkflowHasShortcutInputVariables": True,
    "WFWorkflowInputContentItemClasses": ["WFStringContentItem"],
}
with open(sys.argv[1], "wb") as f: plistlib.dump(plist, f, fmt=plistlib.FMT_XML)
print("ok", len(a), "acciones")
