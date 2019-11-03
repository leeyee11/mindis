import zrender from 'zrender';

export function node({parent,postion,content}){
    const defaultSpacing=[120,72];
    const rect=[240,48];
    const _node=new zrender.Group();
    const _parent=parent;
    const _children=[];
    let _curve;
    const self={
        _node,
        _parent,
        _children,
        getNode,
        getParent,
        getChildAt,
        addChild,
        removeChild,
        remove
    }
    if(getParent()){
        setTimeout(()=>{
            const spos=getNode().position;
            const offset=[spos[0]-rect[0],spos[1]];
            const begin=[0,rect[1]/2];
            const end=[-offset[0],-offset[1]+rect[1]/2]
            const a=[(begin[0]+end[0])/2,begin[1]]
            const b=[(begin[0]+end[0])/2,end[1]]
            console.log(begin,end,a,b);
            _curve=new zrender.BezierCurve({
                shape:{
                    x1:begin[0],y1:begin[1],x2:end[0],y2:end[1],
                    cx1:a[0],cy1:a[1],cx2:b[0],cy2:b[1]
                },
                style:{
                    stroke:'#25c6fc'
                }
            })
            getNode().add(_curve);
        },200)
    }
    function getNode(){
        return _node;
    }
    function getParent(){
        return _parent;
    }
    function getChildren(){
        return _children;
    }
    function getChildAt(i){
        return getChildren()[i];
    }
    function addChild(child){
        _children.push(child);
        _node.add(child.getNode())
    }
    function removeChild(child){
        _children.splice(_children.indexOf(child),1)
        getNode().remove(child.getNode());
    }
    function remove(){
        if(getParent()){
            getParent().removeChild(self);
        }
    }


    const body=new zrender.Rect({
        shape:{
            width:240,
            height:48,
            r:24
        },
        style:{
            fill:'#ffffff',
            text:content||'Root',
            textFill:'#666666',
            shadowColor:'#dfdfdf',
            shadowBlur:18
        }
    })
    body.on('click',()=>{
        const text=window.prompt('Update node content below : ',body.style.text);
        if(text){
            body.attr({'style':{'text':text}});
        }
    });
    const addbtn=new zrender.Circle({
        shape:{
            cx:216,
            cy:24,
            width:24,
            height:24,
            r:12,
        },
        style:{
            text:'+',
            textFill:'#ffffff',
            fill:'#25c6fc'
        }
    })
    addbtn.on('click',()=>{
        const child=window.prompt('Input child node content below : ','Empty');
        if(child){
            const pos=getChildren().length>0
                ?[
                    getChildAt(getChildren().length-1).getNode().position[0],
                    getChildAt(getChildren().length-1).getNode().position[1]+defaultSpacing[1]
                ]
                :[
                    defaultSpacing[0]+rect[0],
                    0
                ];
            
            addChild(new node({
                parent:self,
                postion:pos,
                content:child
            }));
        }
    })
    const rmbtn=new zrender.Circle({
        shape:{
            cx:24,
            cy:24,
            width:24,
            height:24,
            r:12
        },
        style:{
            text:'-',
            textFill:'#ffffff',
            fill:'#ff534d'
        }
    })
    rmbtn.on('click',()=>{
        if(window.confirm('Delete ?')){
            remove();
        }
    })
    _node.updateCurve=function(){
        if(_curve){
            const spos=getNode().position;
            const offset=[spos[0]-rect[0],spos[1]];
            const begin=[0,rect[1]/2];
            const end=[-offset[0],-offset[1]+rect[1]/2]
            const a=[(begin[0]+end[0])/2,begin[1]]
            const b=[(begin[0]+end[0])/2,end[1]]
            _curve.attr({                
                shape:{
                    x1:begin[0],y1:begin[1],x2:end[0],y2:end[1],
                    cx1:a[0],cy1:a[1],cx2:b[0],cy2:b[1]
                }
            })
        }   
    }

    getNode().add(body);
    getNode().add(addbtn);
    getNode().add(rmbtn);

    getNode().attr('position',postion||[0,0])

    return self;
}