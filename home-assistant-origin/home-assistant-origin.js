module.exports = function(RED) {
    function HomeAssistantOriginNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            var context = findByKey(msg.payload, 'context');
            node.log(context);
            
            msg.payload = msg.payload.toLowerCase();
            node.send([msg, msg, msg]);
        });
    }

    function findByKey(obj, kee) {
        if (kee in obj) return obj[kee];
        for(n of Object.values(obj).filter(Boolean).filter(v => typeof v === 'object')) {
            let found = findByKey(n, kee)
            if (found) return found
        }
    }

    RED.nodes.registerType("home-assistant-origin",HomeAssistantOriginNode);
}