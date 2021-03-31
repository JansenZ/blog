function replaceImport(source, _package, replaceWith) {
    const getPackageName = typeof replaceWith === 'function'
        ? replaceWith
        : function (packageName) {
            return replaceWith;
        };

    const getImportExp = function (varName, packageName) {
        if (!varName) return '';
        return "var " + varName + "=" + getPackageName(packageName) + ";";
    };

    _package = '(' + _package + ')';

    source = source
        .replace(new RegExp("\\bimport\\s+\\*\\s+as\\s+([\\w$]+)\\s+from\\s+(\"|')" + _package + "\\2\\s*;?", 'mg'), function (match, name, q, packageName) {
            // import * as from xxxx;
            return getImportExp(name, packageName);
        })
        .replace(new RegExp("\\bimport\\s+([\\w$]+)(?:\\s*,\\s*(\\{[^}]+\\}))?\\s+from\\s+(\"|')" + _package + "\\3\\s*;?", "mg"), function (match, name, names, q, packageName) {
            // import xxx from yyyy;
            // import xxx, { a, b, c } from yyyy;
            return getImportExp(name, packageName)
                + getImportExp(names, packageName);
        })
        .replace(new RegExp("\\bimport\\s+(\\{[^}]+\\})(?:\\s*,\\s*([\\w$]+))?\\s+from\\s+(\"|')" + _package + "\\3\\s*;?", "mg"), function (match, names, name, q, packageName) {
            // import { a, b, c } from yyyy;
            return getImportExp(names, packageName)
                + getImportExp(name, packageName);
        });

    source = source.replace(new RegExp("\\b(?:var|const|let|,)\\s+([\\w$]+)\\s*=\\s*require\\(\\s*(\"|')" + _package + "\\2\\s*\\)\\s*;?", 'mg'), function (match, name, q, packageName) {
        return getImportExp(name, packageName);
    });

    return source;
}

module.exports = function (source, inputSourceMap) {
    this.cacheable();

    var content = replaceImport(source, "core", "window.Core");
    content = replaceImport(content, "core/components", "window.Core.components");
    content = replaceImport(content, "core/widget", "window.Core.widget");
    content = replaceImport(content, "core/services", "window.Core.services");
    content = replaceImport(content, "core/utils", "window.Core.utils");
    content = replaceImport(content, "core/actions", "window.Core.actions");
    content = replaceImport(content, "core/graphics", "window.Core.graphics");
    content = replaceImport(content, "core/methods", "window.Core.methods");
    content = replaceImport(content, "core/constants", "window.Core.constants");
    content = replaceImport(content, "core/operators", "window.Core.operators");
    content = replaceImport(content, "core/snowball", "window.Core.vm");

    content = replaceImport(content, "core/.+", (packageName) => "{};throw new Error('unavaliable import `" + packageName + "`!!')");

    // var options = loaderUtils.getLoaderConfig(this);
    // console.log(options);

    content = replaceImport(content, "react", "window.Core.React");
    content = replaceImport(content, "react-dom", "window.Core.ReactDOM");
    this.callback(null, content, inputSourceMap);
};