import zrender from 'zrender';
import { node } from './node';

(() => {
    const zr = zrender.init(
        document.getElementById("app"),
        {
            width: 'auto',
            width: 'auto'
        }
    );
    const root = new node({});
    zr.add(root.getNode());

    zr.dragData = { drag: false, pos: [0, 0], group: null, target: null };
    zr.on('mousedown', function (e) {
        zr.dragData.pos = [e.event.zrX, e.event.zrY];
        zr.dragData.target = e.target;
        if (e.target == undefined)
            zr.dragData.drag = true;
        else if (e.target.parent && e.target.parent.type == "group") {
            zr.dragData.drag = true;
            zr.dragData.group = e.target.parent;
        }
    });
    zr.on('mouseup', function (e) {
        zr.dragData.drag = false;
        zr.dragData.group = null;
    });
    zr.on('mousemove', function (e) {
        if (zr.dragData.drag != true) return;
        var new_pos = [e.event.zrX, e.event.zrY];
        if (zr.dragData.group != null) {
            var pos = [new_pos[0] - zr.dragData.pos[0], new_pos[1] - zr.dragData.pos[1]];
            // zr.dragData.group.children().forEach(function(x){x.position=[0,0];});
            zr.dragData.group.position[0] += pos[0]; 
            zr.dragData.group.position[1] += pos[1];
            zr.dragData.group.updateCurve()
            zr.dragData.group.dirty();
        } else {
            var pos = [new_pos[0] - zr.dragData.pos[0], new_pos[1] - zr.dragData.pos[1]];
            zr.storage.getDisplayList(true, true).forEach(function (x) {
                x.position[0] += pos[0]; x.position[1] += pos[1]; x.dirty();
            })
        }
        zr.dragData.pos = [e.event.zrX, e.event.zrY];
    });
})();