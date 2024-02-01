module.exports = function(RED) {
    function HomeAssistantOriginNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            if(msg.data == 'undefined') {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: `Invalid (No context)`
                });
                node.send([null, null, null, { payload: true }]);
                return;
            }

            var context = null;
            if(msg.data.hasOwnProperty("context"))
                context = {
                    topic: "sensor",
                    payload: msg.data.context
                }
            else if(msg.data.hasOwnProperty("old_state") && msg.data.hasOwnProperty("new_state")) {
                context = {
                    topic: "state_change",
                    payload: msg.data.new_state.context
                }
            }

            if(context.topic === "sensor" || context.topic == "state_change") {
                if(context.payload.id != null && context.payload.parent_id == null && context.payload.user_id == null)
                    node.send([msg, null, null, { payload: false }])
                else if(context.payload.id != null && context.payload.parent_id == null && context.payload.user_id != null)
                    node.send([null, msg, null, { payload: false }])
                else if(context.payload.id != null && context.payload.parent_id != null && context.payload.user_id == null)
                    node.send([null, null, msg, { payload: false}])
            } else {
                node.send([null, null, null, { payload: true }]);
            }
        });

        
        function findByKey(obj, kee) {
            let found_objects = [];
            if (kee in obj) return [obj[kee]];
//            for(const [key, n] of Object.entries(obj).filter(Boolean).filter(v => typeof v === 'object')) {
            node.warn(obj);
            for(n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
                node.warn(n);
                let found = findByKey(n, kee)
                if (found) found_objects.push(found);
            }
            return found_objects;
        }
    }


    RED.nodes.registerType("home-assistant-origin",HomeAssistantOriginNode);
}