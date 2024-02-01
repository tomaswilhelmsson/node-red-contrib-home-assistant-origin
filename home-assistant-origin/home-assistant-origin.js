module.exports = function(RED) {
    function HomeAssistantOriginNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            if(msg.data == 'undefined') {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: `Invalid (No data)`
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

                node.status({
                    fill: "green",
                    shape: "dot",
                    text: `Valid input`
                });
            } else {
                node.send([null, null, null, { payload: true }]);
            }
        });
    }


    RED.nodes.registerType("home-assistant-origin",HomeAssistantOriginNode);
}