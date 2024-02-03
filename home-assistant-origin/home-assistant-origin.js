module.exports = function(RED) {
    function HomeAssistantOriginNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            var origin = null;

            if(msg.hasOwnProperty("data") && 
                (msg.data.hasOwnProperty("context") || 
                (msg.data.hasOwnProperty("old_state") && msg.data.hasOwnProperty("new_state")))) {
                var context = msg.data?.context || msg.data.new_state.context;
                if(context.id != null && context.parent_id == null && context.user_id == null)
                    origin = "unknown";
                else if(context.id != null && context.parent_id == null && context.user_id != null)
                    origin = "ui";
                else if(context.id != null && context.parent_id != null && context.user_id == null)
                    origin = "other";

                node.status({
                    fill: "green",
                    shape: "dot",
                    text: `Valid input`
                });
            } else {
                node.status({
                    fill: "red",
                    shape: "dot",
                    text: `Invalid (no context)`
                });
                origin = "invalid";
            }

            msg.origin = origin;
            node.send(msg);
        });
    }

    RED.nodes.registerType("home-assistant-origin",HomeAssistantOriginNode);
}