Ext.define('GeoExt.tree.Util', {
    statics: {
        /**
         * Updates the visibility of the layer that is connected to given
         * node.
         *
         * @param {Ext.data.NodeInterface} node The node.
         * @param {boolean} checked the new checked state.
         */
        updateLayerVisibilityByNode: function(node, checked) {
            if(checked != node.get('layer').getVisible()) {
                node._visibilityChanging = true;
                var layer = node.get('layer');
                if(checked && layer.isBaseLayer && layer.map) {
                    //layer.map.setBaseLayer(layer);
                    layer.map.baseLayer = layer;
                } else if(!checked && layer.isBaseLayer && layer.map &&
                          layer.map.baseLayer && layer == layer.map.baseLayer) {
                    // Must prevent the unchecking of radio buttons
                    node.set('checked', layer.getVisible());
                } else {
                    layer.setVisible(checked);
                }
                delete node._visibilityChanging;
            }
            GeoExt.tree.Util.enforceOneLayerVisible(node);
        },

        /**
         * Enforces that one layer of the node is visible.
         *
         * @param {Ext.data.NodeInterface} node The node.
         */
        enforceOneLayerVisible: function(node) {
            var attributes = node.data;
            var group = attributes.checkedGroup;
            // If we are in the baselayer group, the map will take care of
            // enforcing visibility.
            if(group && group !== "gx_baselayer") {
                var layer = node.get('layer');
                var checkedNodes = node.getOwnerTree().getChecked();
                var checkedCount = 0;
                // enforce "not more than one visible"
                Ext.each(checkedNodes, function(n){
                    var l = n.data.layer;
                    if(!n.data.hidden && n.data.checkedGroup === group) {
                        checkedCount++;
                        if(l != layer && attributes.checked) {
                            l.setVisible(false);
                        }
                    }
                });
                // enforce "at least one visible"
                if(checkedCount === 0 && attributes.checked == false) {
                    layer.setVisible(true);
                }
            }
        }
    }
});
