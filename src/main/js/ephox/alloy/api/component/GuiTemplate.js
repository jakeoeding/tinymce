define(
  'ephox.alloy.api.component.GuiTemplate',

  [
    'ephox.boulder.api.Objects',
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.epithet.Resolve',
    'ephox.highway.Merger',
    'ephox.numerosity.api.JSON',
    'ephox.peanut.Fun',
    'ephox.perhaps.Result',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Element',
    'ephox.sugar.api.Html',
    'ephox.sugar.api.Node',
    'ephox.sugar.api.Text',
    'ephox.sugar.api.Traverse',
    'ephox.violin.Strings',
    'global!Error',
    'global!String'
  ],

  function (Objects, Arr, Obj, Resolve, Merger, Json, Fun, Result, Attr, Element, Html, Node, Text, Traverse, Strings, Error, String) {
    var getAttrs = function (elem) {
      var attributes = elem.dom().attributes !== undefined ? elem.dom().attributes : [ ];
      return Arr.foldl(attributes, function (b, attr) {
        // Make class go through the class path. Do not list it as an attribute.
        if (attr.name === 'class') return b;
        else return Merger.deepMerge(b, Objects.wrap(attr.name, attr.value));
      }, {});
    };

    var getClasses = function (elem) {
      return Array.prototype.slice.call(elem.dom().classList, 0);
    };

    var readText = function (elem) {
      var text = Text.get(elem);
      return text.trim().length > 0 ? [ { text: text } ] : [ ];
    };

    var readChildren = function (elem) {
      if (Node.isText(elem)) return readText(elem);
      else if (Node.isComment(elem)) return [ ];
      else {
        var attrs = getAttrs(elem);
        var classes = getClasses(elem);
        var children = Traverse.children(elem);

        var components = Arr.bind(children, function (child) {
          if (Node.isText(child)) return readText(child);
          else return readChildren(child);
        });

        return [{
          dom: {
            tag: Node.name(elem),
            attributes: attrs,
            classes: classes
          },
          components: components
        }];
      }
    };

    var read = function (elem) {
      var attrs = getAttrs(elem);
      var classes = getClasses(elem);

      var children = Traverse.children(elem);

      var components = Arr.bind(children, function (child) {
        return readChildren(child);
      });

      return {
        dom: {
          tag: Node.name(elem),
          attributes: attrs,
          classes: classes
        },
        components: components
      };
    };

    var readHtml = function (html) {
      var elem = Element.fromHtml(html);
      return Node.isText(elem) ? Result.error('Template text must contain an element!') : Result.value(
        read(elem)
      );
    };

    return {
      readHtml: readHtml
    };
  }
);