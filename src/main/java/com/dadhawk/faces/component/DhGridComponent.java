package com.dadhawk.faces.component;

import jakarta.faces.application.ResourceDependencies;
import jakarta.faces.application.ResourceDependency;
import jakarta.faces.component.FacesComponent;
import jakarta.faces.component.UIComponentBase;
import jakarta.faces.context.FacesContext;
import jakarta.faces.context.ResponseWriter;

import java.io.IOException;
import java.util.Map;

/**
 * DhGridComponent — High-Performance Jakarta Faces 4.0 Data Grid Component.
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
public class DhGridComponent extends UIComponentBase {

    public static final String COMPONENT_FAMILY = "com.dadhawk.faces.component";
    public static final String COMPONENT_TYPE = "com.dadhawk.faces.component.DhGridComponent";

    enum PropertyKeys {
        rowCount, colCount, content, componentMap, captions
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
        return getStateHelper().eval(PropertyKeys.content, null);
    }

    public void setContent(Object content) {
        getStateHelper().put(PropertyKeys.content, content);
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

    @Override
    public void encodeBegin(FacesContext context) throws IOException {
        if (!isRendered()) {
            return;
        }

        ResponseWriter writer = context.getResponseWriter();

        writer.startElement("dh-grid-element", this);
        writer.writeAttribute("id", getClientId(context), "id");
        writer.writeAttribute("rows", getRowCount(), "rows");
        writer.writeAttribute("cols", getColCount(), "cols");
        writer.writeAttribute("content", toJson(getContent()), "content");
        if (getCaptions() != null) {
            writer.writeAttribute("captions", toJson(getCaptions()), "captions");
        }
        writer.writeAttribute("components", toJson(getComponentMap()), "components");
    }

    @Override
    public void encodeEnd(FacesContext context) throws IOException {
        if (!isRendered()) {
            return;
        }
        ResponseWriter writer = context.getResponseWriter();
        writer.endElement("dh-grid-element");
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
