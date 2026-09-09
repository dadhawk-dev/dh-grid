# ⚡ DhGrid — High-Performance Data Grid Component for Jakarta Faces 4.0 & W3C Web Components


[![Version](https://img.shields.io/badge/version-1.0.0--gamma-blue.svg?style=for-the-badge)](releases/1.0.0-gamma.md)
[![Jakarta Faces](https://img.shields.io/badge/Jakarta%20Faces-4.0-orange.svg?style=for-the-badge)](https://jakarta.ee/specifications/faces/4.0/)
[![W3C Web Component](https://img.shields.io/badge/Web%20Component-W3C%20Standard-purple.svg?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
[![License](https://img.shields.io/badge/License-GNU_LGPL_v3.0-blue.svg?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg?style=for-the-badge)](pom.xml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen.svg?style=for-the-badge&logo=github)](https://dadhawk-dev.github.io/dh-grid/)

**DhGrid** is an open-source, lightweight, ultra-fast, zero-dependency data grid component designed for both **Jakarta EE / Jakarta Faces 4.0 (JSF)** applications and pure **W3C Web Components (`<dh-grid-element>`)**.

It features intuitive inline editing, keyboard-driven cell navigation (`Arrow Keys`, `Tab`, `Enter`, `Escape`), custom Web Component editor widgets (`<status-selector>`, `<rating-editor>`, `<priority-badge-editor>`), real-time reactive event streams, dynamic matrix expansion, **Backend Form Save Integration**, **Global JavaScript State (`window.dhGridData`)**, **Composite Parent-Child Tree Captions**, **Cell ReadOnly Control**, **Dynamic Cell Styling Strategies**, and **PrimeFaces Theme Compatibility**.

> 🌐 **Interactive Online Showcase**: Want to test DhGrid live right now in your browser?  
> 👉 **[Click here to open the Interactive Live Demo Page](https://dadhawk-dev.github.io/dh-grid/)** (or click the preview image below) to explore live inline editing, custom editor widgets, tree headers, and live-editable code execution!

[![DhGrid Web Component Showcase Live Demo](assets/demo-preview.png)](https://dadhawk-dev.github.io/dh-grid/)

---

## 🌟 Key Features & Highlights

- 🌐 **Interactive Live Demo Showcase**: Click **[https://dadhawk-dev.github.io/dh-grid/](https://dadhawk-dev.github.io/dh-grid/)** to experience all grid features, preset datasets, and live code runners directly in your browser.
- 💾 **Backend Form Save & Automatic Model Binding**: Extends `UIInput` to decode submitted cell updates via hidden form input (`clientId_input`) and sync directly with backing bean properties (`#{gridBean.content}`) on form submit or AJAX action methods (`action="#{gridBean.saveGrid}"`).
- 🌐 **Global Client State Sync (`window.dhGridData`)**: Maintains real-time active JSON matrix contents in `window.dhGridData[gridId]` and `window.dhGridDataContent` whenever cells are edited, rows added, or columns expanded.
- ⌨️ **Keyboard Navigation & Focus Control**: Full keyboard movement with `Arrow Keys` (Up/Down/Left/Right), `Tab` / `Shift+Tab` (move right/left & wrap rows), `Enter` (launch editor / commit & move down), and `Escape` (cancel edit & restore focus).
- 🎨 **PrimeFaces Theme Compatibility (`css-compatible="primethemes"`)**: Seamlessly binds Shadow DOM table styles (`--dh-table-bg`, `--dh-border-color`, `--dh-cell-color`) to active PrimeFaces CSS variables (`--surface-a`, `--surface-border`, `--text-color`, `--primary-color`).
- 🌳 **Composite Parent-Child Tree Captions**: Define multi-level hierarchical headers compactly using path notation (`"Sales / H1 / Q1"`, `"Sales / H1 / Q2"`), 2D arrays, or nested tree objects.
- 🔒 **Cell ReadOnly Control (`readOnly`, `readOnlyCells`)**: Global grid locking or per-cell / per-column read-only rule maps with lock-shake animation feedback.
- 🎨 **Dynamic Cell Styling Strategy (`cellStyles`)**: Custom background colors, text colors, and font styles per cell, column, or row using shorthand objects or CSS rule strings.
- 🧩 **Custom Web Component Cell Editors**: Map custom interactive widgets (`<status-selector>`, `<rating-editor>`) directly to grid cells via simple `componentMap` JSON.
- ⚡ **Zero External JS Dependencies**: Fully encapsulated inside Shadow DOM with native performance, zero external framework locks.
- ☕ **Native Jakarta Faces 4.0 JSF Integration**: Drop-in `<dh:dhGrid>` Facelets tag library with direct EL expression binding (`#{gridBean.content}`, `#{gridBean.readOnlyCells}`, `#{gridBean.cellStyles}`, `#{gridBean.cssCompatible}`).
- 📡 **Real-Time Reactive Event System**: Emits composed `cell-change` CustomEvents for instant client-side or server-side reactive sync.

---

## 📦 Quick Installation & Setup

### 🅰️ Method 1: GitHub Pages Maven Repository (Recommended)

Add the GitHub Pages Maven Repository to your project's `pom.xml` to automatically download `dhgrid-component-1.0.0.jar`:

```xml
<repositories>
    <repository>
        <id>dadhawk-dhgrid-repo</id>
        <name>DhGrid GitHub Maven Repository</name>
        <url>https://dadhawk-dev.github.io/dh-grid/maven-repo/</url>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.dadhawk.faces</groupId>
        <artifactId>dhgrid-component</artifactId>
        <version>1.0.0</version>
    </dependency>
</dependencies>
```

---

### 🅱️ Method 2: Direct JAR Download & Local Maven Install (`~/.m2`)

> 📦 **Direct Download**: **[Download Maven JAR v1.0.0 (`dhgrid-component-1.0.0.jar`)](https://dadhawk-dev.github.io/dh-grid/downloads/dhgrid-component-1.0.0.jar)**

If you downloaded the JAR manually, install it to your local Maven repository:

```bash
mvn install:install-file \
  -Dfile=dhgrid-component-1.0.0.jar \
  -DgroupId=com.dadhawk.faces \
  -DartifactId=dhgrid-component \
  -Dversion=1.0.0 \
  -Dpackaging=jar
```

---

## 💡 Quick-Start Developer Examples

> 💡 **Try it live in your browser!** Click **[▶ Open Interactive Live Demo Showcase Page](https://dadhawk-dev.github.io/dh-grid/)** to test and edit these code snippets live in an interactive web application!

### 🅰️ Vanilla JavaScript (Pure HTML5 + Web Components) &nbsp; [![▶ RUN Live Example](https://img.shields.io/badge/%E2%96%B6_RUN-Live_Example-28a745?style=for-the-badge)](https://dadhawk-dev.github.io/dh-grid/)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="resources/dadhawk/js/dh-grid.js"></script>
  <script src="resources/js/custom-editors.js"></script>
</head>
<body>
  <!-- 1. Embedded Web Component (Declarative HTML Attributes: readonly="true" / readOnly="true" / read-only="true") -->
  <dh-grid-element id="myGrid"
                   rows="5"
                   cols="5"
                   readonly="true"
                   readonly-cells='{"r1_c0": true, "r3": true}'
                   cell-styles='{"r1_c3": "background-color: rgba(34, 197, 94, 0.15); color: #15803d; font-weight: 700;", "c1": "color: #0284c7; font-weight: 600;"}'>
  </dh-grid-element>

  <script>
    const grid = document.getElementById('myGrid');

    // 🔒 2. Overall Grid ReadOnly Property API (grid.readOnly / grid.readonly)
    grid.readOnly = true; // Lock all matrix cells grid-wide dynamically (set grid.readOnly = false to unlock)

    // 3. Define Composite Parent-Child Tree Captions
    grid.setAttribute('captions', JSON.stringify([
      "Financial Performance / H1 (Q1-Q2) / Revenue ($)",
      "Financial Performance / H1 (Q1-Q2) / Expenses ($)",
      "Financial Performance / H2 (Q3-Q4) / Revenue ($)",
      "Financial Performance / H2 (Q3-Q4) / Expenses ($)",
      "Overall Status"
    ]));

    // 4. Populate Grid Content Matrix
    grid.setAttribute('content', JSON.stringify([
      ["Quarter", "Revenue ($)", "Expenses ($)", "Margin (%)", "Performance"],
      ["Q1 2026", "$120,000", "$85,000", "29.1%", "Completed"],
      ["Q2 2026", "$145,000", "$92,000", "36.5%", "Active"],
      ["Q3 2026", "$160,000", "$98,000", "38.7%", "Pending"],
      ["Q4 2026", "$210,000", "$110,000", "47.6%", "In Review"]
    ]));

    // 5. Map Custom Web Component Editors to Specific Cells
    grid.setAttribute('components', JSON.stringify({
      "r1_c4": "status-selector",
      "r2_c4": "status-selector",
      "r3_c4": "status-selector",
      "r4_c4": "status-selector"
    }));

    // 6. Configure Cell ReadOnly Rules & Custom Styling (Imperative JS Property API)
    // Note: {"r1_c0": true} locks single cell; {"r3": true} locks entire row 3; {"c0": true} locks column 0.
    grid.readOnlyCells = { "r1_c0": true, "r3": true };
    // Note: {"r1_c3": "..."} styles single cell; {"c1": "..."} styles entire column 1; {"r2": "..."} styles row 2.
    grid.cellStyles = {
      "r1_c3": "background-color: rgba(34, 197, 94, 0.15); color: #15803d; font-weight: 700;",
      "c1": "color: #0284c7; font-weight: 600;"
    };

    // 6. Listen for Cell Change Events
    grid.addEventListener('cell-change', (e) => {
      console.log(`Row ${e.detail.row}, Col ${e.detail.col} updated -> "${e.detail.value}"`);
    });
  </script>
</body>
</html>
```

---

### 🅱️ Jakarta Faces 4.0 (JSF View + Managed Bean)

#### 1. Facelets View (`index.xhtml`)

```xml
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="jakarta.faces.html"
      xmlns:f="jakarta.faces.core"
      xmlns:dh="http://dadhawk.com/faces">
<h:head>
    <title>Jakarta Faces 4.0 DhGrid Integration</title>
</h:head>
<h:body>
    <h:form id="gridForm">
        <!-- Global Feedback Messages -->
        <h:messages id="messages" globalOnly="true"
                    style="color: #4ade80; font-weight: 700; margin-bottom: 10px;" />

        <!-- 1. DhGrid Component with Property EL Bindings -->
        <dh:dhGrid id="myGrid"
                   rowCount="#{gridBean.rowCount}"
                   colCount="#{gridBean.colCount}"
                   cssCompatible="primethemes"
                   content="#{gridBean.content}"
                   captions="#{gridBean.captions}"
                   readOnly="#{gridBean.readOnly}"
                   readOnlyCells="#{gridBean.readOnlyCells}"
                   cellStyles="#{gridBean.cellStyles}"
                   componentMap="#{gridBean.componentMap}" />

        <!-- 2. Action Toolbar: Lock/Unlock & Save to Backend DB -->
        <div style="margin-top: 15px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
            <!-- Toggle Overall Grid ReadOnly State -->
            <h:commandButton value="#{gridBean.readOnly ? '🔓 Unlock Grid' : '🔒 Lock Grid'}"
                             action="#{gridBean.toggleReadOnly}">
                <f:ajax execute="@form" render="gridForm:myGrid" />
            </h:commandButton>

            <!-- 💾 Save Grid Data Matrix to Backend DB -->
            <h:commandButton value="💾 Save Grid Data to Backend"
                             action="#{gridBean.saveData}"
                             style="background: #10b981; color: #ffffff; font-weight: 700; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                <f:ajax execute="@form" render="messages saveMsg gridForm:myGrid" />
            </h:commandButton>

            <!-- Status Output -->
            <h:outputText id="saveMsg" value="#{gridBean.lastSaveStatus}"
                          style="color: #38bdf8; font-weight: 600;" />
        </div>
    </h:form>
</h:body>
</html>
```

#### 2. CDI Managed Bean (`GridBean.java`)

```java
package com.dadhawk.faces.demo;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import java.io.Serializable;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Named("gridBean")
@SessionScoped
public class GridBean implements Serializable {

    private String content; // Updated bi-directionally by <dh:dhGrid> hidden input
    private Boolean readOnly = false; // Overall grid read-only state flag
    private String lastSaveStatus = "";

    private Integer rowCount = 5;
    private Integer colCount = 5;
    private String captions = "[\"Sales / H1 / Q1\", \"Sales / H1 / Q2\", \"Sales / H2 / Q3\", \"Sales / H2 / Q4\", \"Status\"]";
    private String readOnlyCells = "{\"r1_c0\": true, \"r3\": true}";
    private String cellStyles = "{\"r1_c3\": \"background-color: rgba(34, 197, 94, 0.15); color: #15803d; font-weight: 700;\", \"c1\": \"color: #0284c7; font-weight: 600;\"}";
    private String componentMap = "{\"r1_c4\": \"status-selector\"}";

    @PostConstruct
    public void init() {
        this.content = "[" +
            "[\"Quarter\", \"Revenue ($)\", \"Expenses ($)\", \"Margin (%)\", \"Performance\"]," +
            "[\"Q1 2026\", \"$120,000\", \"$85,000\", \"29.1%\", \"Completed\"]," +
            "[\"Q2 2026\", \"$145,000\", \"$92,000\", \"36.5%\", \"Active\"]" +
        "]";
    }

    /**
     * 💾 Action method to process and persist grid data to backend DB.
     * Invoked via <h:commandButton action="#{gridBean.saveData}"> with <f:ajax execute="@form">
     */
    public String saveData() {
        System.out.println("Saving modified grid matrix to backend DB: " + this.content);

        // PERSISTENCE LOGIC (e.g. JPA / Hibernate / Spring Data Repository):
        // myGridRepository.save(this.content);

        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        this.lastSaveStatus = "Saved grid matrix to backend DB at " + time + "!";

        FacesContext.getCurrentInstance().addMessage(null,
            new FacesMessage(FacesMessage.SEVERITY_INFO, "Backend Saved", this.lastSaveStatus));

        return null;
    }

    /**
     * 🔒 Action method to toggle overall grid read-only state.
     */
    public void toggleReadOnly() {
        this.readOnly = !this.readOnly;
    }

    // Getters & Setters for JSF EL
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Boolean isReadOnly() { return readOnly; }
    public Boolean getReadOnly() { return readOnly; }
    public void setReadOnly(Boolean readOnly) { this.readOnly = readOnly; }
    public String getLastSaveStatus() { return lastSaveStatus; }
    public Integer getRowCount() { return rowCount; }
    public Integer getColCount() { return colCount; }
    public String getCaptions() { return captions; }
    public String getReadOnlyCells() { return readOnlyCells; }
    public String getCellStyles() { return cellStyles; }
    public String getComponentMap() { return componentMap; }
}
```

---

### 🔀 Minimal Feature Usage Snippets

#### 🎨 1. PrimeFaces Theme Compatibility (`css-compatible="primethemes"`)
Seamlessly bind Shadow DOM table styling to active PrimeFaces / PrimeVue theme CSS variables (`--surface-a`, `--surface-b`, `--surface-border`, `--text-color`, `--primary-color`). Enables instant compatibility with all PrimeFaces profile themes (e.g., `saga-blue`, `arya`, `vela`, `luna-amber`):

```html
<!-- W3C Web Component (Pure HTML5) -->
<dh-grid-element id="myGrid"
                 css-compatible="primethemes"
                 rows="5" cols="5">
</dh-grid-element>
```

```xml
<!-- Jakarta Faces 4.0 Taglib (Facelets View) -->
<dh:dhGrid id="myGrid"
           cssCompatible="primethemes"
           content="#{gridBean.content}"
           captions="#{gridBean.captions}" />
```

#### 🔒 2. Cell ReadOnly Control (`readOnly`, `readOnlyCells`)
Lock all cells globally (`readOnly="true"`) or configure per-cell/per-column read-only rule maps:

```html
<!-- W3C Web Component (Pure HTML5) -->
<!-- Lock single cell ("r1_c0"), entire row ("r3"), or entire column ("c0") -->
<dh-grid-element id="myGrid"
                 readonly-cells='{"r1_c0": true, "r3": true, "c0": true}'>
</dh-grid-element>
```

```xml
<!-- Jakarta Faces 4.0 Taglib (Facelets View) -->
<dh:dhGrid id="myGrid"
           readOnly="false"
           readOnlyCells="#{gridBean.readOnlyCells}" />
```

#### 🎨 3. Dynamic Cell Styling Strategy (`cellStyles`)
Apply custom background colors, text colors, and font styles per cell, column, or row using inline CSS strings or JSON objects:

```html
<!-- W3C Web Component (Pure HTML5) -->
<!-- Style single cell ("r1_c3"), entire column ("c1"), or entire row ("r2") -->
<dh-grid-element id="myGrid"
                 cell-styles='{"r1_c3": "background-color: rgba(34, 197, 94, 0.15); color: #4ade80; font-weight: 700;", "c1": "color: #38bdf8; font-weight: 600;", "r2": "background: rgba(99, 102, 241, 0.1);"}'>
</dh-grid-element>
```

```xml
<!-- Jakarta Faces 4.0 Taglib (Facelets View) -->
<dh:dhGrid id="myGrid"
           cellStyles="#{gridBean.cellStyles}" />
```

---

## 🛠️ CLI Quick Start Commands

```bash
# Build component library & install to ~/.m2
mvn clean install

# Launch Jetty 11 server (Jakarta Faces 4.0 runtime)
cd demo
mvn jetty:run
```

Access local endpoints:
- **Jakarta Faces 4.0 Showcase**: `http://localhost:8085/index.xhtml`

---

## 🏷️ Release History & Tags

- **`v1.0.0`** ([Release Notes](releases/1.0.0.md)):
  - Official stable release of **Dadhawk DhGrid Component**.
  - Features dual-mode JSF 4.0 (`<dh:dhGrid>`) & W3C Web Component (`<dh-grid-element>`) support, parent-child composite tree headers, intelligent input editors (`input-text`, `input-number`, `input-money`), locale-aware formatting, granular read-only matrix locking, dynamic styling strategies (`cellStyles`), keyboard navigation, PrimeFaces theme compatibility (`css-compatible="primethemes"`), and native JSF form model synchronization (`UIInput`).

---

## 🏷️ GitHub Topics & SEO Tags

`#jakarta-faces` `#jsf` `#web-components` `#grid-component` `#datagrid` `#java` `#jakarta-ee` `#handsontable-alternative` `#web-component` `#ui-components` `#custom-elements` `#facelets` `#component-library` `#shadow-dom`

---

## 📄 License

Distributed under the **GNU Lesser General Public License v3.0 (LGPL v3.0)**. See `LICENSE` for details.

Developed with ❤️ by **Telman Shahbazov / Dadhawk** with **Google DeepMind Antigravity AI** ([https://github.com/dadhawk-dev](https://github.com/dadhawk-dev)).
