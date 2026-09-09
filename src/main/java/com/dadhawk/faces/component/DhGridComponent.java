package com.dadhawk.faces.component;

import jakarta.faces.application.ResourceDependencies;
import jakarta.faces.application.ResourceDependency;
import jakarta.faces.component.FacesComponent;
import jakarta.faces.component.UIInput;
import jakarta.faces.context.FacesContext;
import jakarta.faces.context.ResponseWriter;

import jakarta.el.ValueExpression;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * DhGridComponent — High-Performance Jakarta Faces 4.0 Data Grid Component.
 * Supports automatic decode form submission, value binding, and backend action saving.
 *
 * @author Telman Shahbazov / Dadhawk (with Google DeepMind Antigravity AI)
 */
@FacesComponent(
    value = "com.dadhawk.faces.component.DhGridComponent",
    createTag = true,
    tagName = "dhGrid",
    namespace = "http://dadhawk.com/faces"
)
@ResourceDependencies({
    @ResourceDependency(library = "dadhawk", name = "js/dh-grid.js", target = "head")
})
public class DhGridComponent extends UIInput {

    public static final String COMPONENT_FAMILY = "com.dadhawk.faces.component";
    public static final String COMPONENT_TYPE = "com.dadhawk.faces.component.DhGridComponent";

    enum PropertyKeys {
        rowCount, colCount, content, componentMap, captions, readOnly, readonly, readOnlyCells, cellStyles, cssCompatible, locale
    }

    public DhGridComponent() {
        setRendererType(null);
    }

    @Override
    public String getFamily() {
        return COMPONENT_FAMILY;
    }

    public Integer getRowCount() {
        return (Integer) getStateHelper().eval(PropertyKeys.rowCount, 5);
    }

    public void setRowCount(Integer rowCount) {
        getStateHelper().put(PropertyKeys.rowCount, rowCount);
    }

    public Integer getColCount() {
        return (Integer) getStateHelper().eval(PropertyKeys.colCount, 5);
    }

    public void setColCount(Integer colCount) {
        getStateHelper().put(PropertyKeys.colCount, colCount);
    }

    public Object getContent() {
        Object val = super.getValue();
        if (val != null) {
            return val;
        }
        return getStateHelper().eval(PropertyKeys.content, null);
    }

    public void setContent(Object content) {
        getStateHelper().put(PropertyKeys.content, content);
        setValue(content);
    }

    public Object getCaptions() {
        return getStateHelper().eval(PropertyKeys.captions, null);
    }

    public void setCaptions(Object captions) {
        getStateHelper().put(PropertyKeys.captions, captions);
    }

    @SuppressWarnings("unchecked")
    public Map<String, String> getComponentMap() {
        return (Map<String, String>) getStateHelper().eval(PropertyKeys.componentMap, null);
    }

    public void setComponentMap(Map<String, String> componentMap) {
        getStateHelper().put(PropertyKeys.componentMap, componentMap);
    }

    public Boolean isReadOnly() {
        Boolean ro = (Boolean) getStateHelper().eval(PropertyKeys.readOnly, null);
        if (ro != null) {
            return ro;
        }
        ro = (Boolean) getStateHelper().eval(PropertyKeys.readonly, null);
        return ro != null ? ro : false;
    }

    public Boolean getReadOnly() {
        return isReadOnly();
    }

    public Boolean isReadonly() {
        return isReadOnly();
    }

    public Boolean getReadonly() {
        return isReadOnly();
    }

    public void setReadOnly(Boolean readOnly) {
        getStateHelper().put(PropertyKeys.readOnly, readOnly);
    }

    public void setReadonly(Boolean readonly) {
        getStateHelper().put(PropertyKeys.readonly, readonly);
    }

    public Object getReadOnlyCells() {
        return getStateHelper().eval(PropertyKeys.readOnlyCells, null);
    }

    public void setReadOnlyCells(Object readOnlyCells) {
        getStateHelper().put(PropertyKeys.readOnlyCells, readOnlyCells);
    }

    public Object getCellStyles() {
        return getStateHelper().eval(PropertyKeys.cellStyles, null);
    }

    public void setCellStyles(Object cellStyles) {
        getStateHelper().put(PropertyKeys.cellStyles, cellStyles);
    }

    public String getLocale() {
        String loc = (String) getStateHelper().eval(PropertyKeys.locale, null);
        if (loc != null && !loc.trim().isEmpty()) {
            return loc;
        }
        FacesContext ctx = getFacesContext();
        if (ctx != null && ctx.getViewRoot() != null && ctx.getViewRoot().getLocale() != null) {
            return ctx.getViewRoot().getLocale().toString().replace('_', '-');
        }
        return "en-US";
    }

    public void setLocale(String locale) {
        getStateHelper().put(PropertyKeys.locale, locale);
    }

    public Object getCssCompatible() {
        return getStateHelper().eval(PropertyKeys.cssCompatible, null);
    }

    public void setCssCompatible(Object cssCompatible) {
        getStateHelper().put(PropertyKeys.cssCompatible, cssCompatible);
    }

    @Override
    public void decode(FacesContext context) {
        if (context == null || !isRendered()) {
            return;
        }

        String clientId = getClientId(context);
        String inputParam = clientId + "_input";
        Map<String, String> requestMap = context.getExternalContext().getRequestParameterMap();

        if (requestMap.containsKey(inputParam)) {
            String submittedJson = requestMap.get(inputParam);
            if (submittedJson != null && !submittedJson.trim().isEmpty()) {
                String[][] parsedMatrix = parseJsonMatrix(submittedJson);
                setSubmittedValue(parsedMatrix);
            }
        }
    }

    @Override
    public void updateModel(FacesContext context) {
        if (context == null) {
            return;
        }

        Object submitted = getSubmittedValue();
        if (submitted == null && isLocalValueSet()) {
            submitted = getLocalValue();
        }

        if (submitted != null) {
            ValueExpression ve = getValueExpression(PropertyKeys.content.toString());
            if (ve == null) {
                ve = getValueExpression("value");
            }

            if (ve != null) {
                try {
                    ve.setValue(context.getELContext(), submitted);
                } catch (Exception e) {
                    context.getExternalContext().log("DhGridComponent: Error updating model ValueExpression", e);
                }
            }

            setContent(submitted);
            setValue(null);
            setSubmittedValue(null);
            setLocalValueSet(false);
        }
    }

    @Override
    public void encodeBegin(FacesContext context) throws IOException {
        if (!isRendered()) {
            return;
        }

        ResponseWriter writer = context.getResponseWriter();
        String clientId = getClientId(context);
        String hiddenInputId = clientId + "_input";

        // Render W3C Web Component <dh-grid-element> FIRST as root JSF component element
        writer.startElement("dh-grid-element", this);
        writer.writeAttribute("id", clientId, "id");
        writer.writeAttribute("rows", getRowCount(), "rows");
        writer.writeAttribute("cols", getColCount(), "cols");
        writer.writeAttribute("content", toJson(getContent()), "content");
        if (getCaptions() != null) {
            writer.writeAttribute("captions", toJson(getCaptions()), "captions");
        }
        writer.writeAttribute("components", toJson(getComponentMap()), "components");
        if (isReadOnly() != null && isReadOnly()) {
            writer.writeAttribute("readonly", "true", "readOnly");
        }
        if (getReadOnlyCells() != null) {
            writer.writeAttribute("readonly-cells", toJson(getReadOnlyCells()), "readOnlyCells");
        }
        if (getCellStyles() != null) {
            writer.writeAttribute("cell-styles", toJson(getCellStyles()), "cellStyles");
        }
        if (getCssCompatible() != null) {
            writer.writeAttribute("css-compatible", getCssCompatible().toString(), "cssCompatible");
        }
        if (getLocale() != null) {
            writer.writeAttribute("locale", getLocale(), "locale");
        }

        // Render hidden input inside component for JSF form submission sync
        writer.startElement("input", this);
        writer.writeAttribute("type", "hidden", null);
        writer.writeAttribute("id", hiddenInputId, "id");
        writer.writeAttribute("name", hiddenInputId, "name");
        writer.writeAttribute("value", toJson(getContent()), "value");
        writer.endElement("input");
    }

    @Override
    public void encodeEnd(FacesContext context) throws IOException {
        if (!isRendered()) {
            return;
        }
        ResponseWriter writer = context.getResponseWriter();
        writer.endElement("dh-grid-element");
    }

    public static String[][] parseJsonMatrix(String json) {
        if (json == null || json.trim().isEmpty() || json.trim().equals("[]")) {
            return new String[0][0];
        }
        try {
            json = json.trim();
            if (json.startsWith("[")) json = json.substring(1);
            if (json.endsWith("]")) json = json.substring(0, json.length() - 1);
            json = json.trim();

            List<List<String>> rows = new ArrayList<>();
            List<String> currentRow = null;
            StringBuilder sb = new StringBuilder();
            boolean inString = false;
            boolean inRow = false;
            boolean escaped = false;

            for (int i = 0; i < json.length(); i++) {
                char c = json.charAt(i);

                if (escaped) {
                    sb.append(c);
                    escaped = false;
                    continue;
                }

                if (c == '\\') {
                    escaped = true;
                    continue;
                }

                if (inString) {
                    if (c == '"') {
                        inString = false;
                    } else {
                        sb.append(c);
                    }
                    continue;
                }

                if (c == '"') {
                    inString = true;
                    continue;
                }

                if (c == '[') {
                    inRow = true;
                    currentRow = new ArrayList<>();
                    sb.setLength(0);
                } else if (c == ']') {
                    if (inRow && currentRow != null) {
                        String val = sb.toString().trim();
                        if (val.startsWith("\"") && val.endsWith("\"") && val.length() >= 2) {
                            val = val.substring(1, val.length() - 1);
                        }
                        currentRow.add(val);
                        rows.add(currentRow);
                        inRow = false;
                        sb.setLength(0);
                    }
                } else if (c == ',') {
                    if (inRow && currentRow != null) {
                        String val = sb.toString().trim();
                        if (val.startsWith("\"") && val.endsWith("\"") && val.length() >= 2) {
                            val = val.substring(1, val.length() - 1);
                        }
                        currentRow.add(val);
                        sb.setLength(0);
                    }
                } else if (!Character.isWhitespace(c)) {
                    sb.append(c);
                }
            }

            if (rows.isEmpty()) return new String[0][0];

            String[][] result = new String[rows.size()][];
            for (int r = 0; r < rows.size(); r++) {
                List<String> rowList = rows.get(r);
                result[r] = rowList.toArray(new String[0]);
            }
            return result;
        } catch (Exception e) {
            return new String[0][0];
        }
    }

    private String toJson(Object obj) {
        if (obj == null) {
            return "[]";
        }
        if (obj instanceof String str) {
            return str;
        }
        if (obj instanceof String[] array) {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < array.length; i++) {
                sb.append("\"").append(escape(array[i])).append("\"");
                if (i < array.length - 1) {
                    sb.append(",");
                }
            }
            sb.append("]");
            return sb.toString();
        }
        if (obj instanceof java.util.Collection<?> col) {
            StringBuilder sb = new StringBuilder("[");
            int i = 0;
            for (Object item : col) {
                sb.append("\"").append(escape(item != null ? item.toString() : "")).append("\"");
                if (++i < col.size()) {
                    sb.append(",");
                }
            }
            sb.append("]");
            return sb.toString();
        }
        if (obj instanceof String[][] array) {
            StringBuilder sb = new StringBuilder("[");
            for (int r = 0; r < array.length; r++) {
                sb.append("[");
                for (int c = 0; c < array[r].length; c++) {
                    sb.append("\"").append(escape(array[r][c])).append("\"");
                    if (c < array[r].length - 1) {
                        sb.append(",");
                    }
                }
                sb.append("]");
                if (r < array.length - 1) {
                    sb.append(",");
                }
            }
            sb.append("]");
            return sb.toString();
        } else if (obj instanceof Map<?, ?> map) {
            StringBuilder sb = new StringBuilder("{");
            int i = 0;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                sb.append("\"").append(escape(entry.getKey().toString())).append("\":\"")
                  .append(escape(entry.getValue().toString())).append("\"");
                if (++i < map.size()) {
                    sb.append(",");
                }
            }
            sb.append("}");
            return sb.toString();
        }
        return "[]";
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
