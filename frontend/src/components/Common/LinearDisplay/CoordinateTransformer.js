class CoordinateTransformer 
{
    constructor(physicalRect, logicalRect)
    {
        this.setRects(physicalRect, logicalRect);
        //this.trace = true;
    }   
    setRects(physicalRect, logicalRect)
    {
        this.setBounds(logicalRect.x1, logicalRect.y1, logicalRect.x2, logicalRect.y2,
                physicalRect.x1, physicalRect.y1, physicalRect.x2, physicalRect.y2);
    }
    setBounds(x1,y1,x2,y2,px1,py1,px2,py2)
    {
        this.x1=x1;
        this.x2=x2;
        this.y1=y1;
        this.y2=y2;
        this.px1=px1;
        this.px2=px2;
        this.py1=py1;
        this.py2=py2;
        this.mx=(this.px2-this.px1)/(this.x2-this.x1);
        this.my=(this.py2-this.py1)/(this.y2-this.y1);
    }
    toPhysicalx(lx)
    {
        let px=((lx-this.x1)*this.mx);
        
        if(this.trace)console.log('toPhysicalx:', lx,'->',px);
        
        return px;
    }
    toPhysicaly(ly)
    {
        let py=((ly-this.y1)*this.my);
        if(this.trace)console.log('toPhysicaly:', ly,'->',py);
        return py;
    }
    toLogicalX(px)
    {
        let lx=(px/this.mx)+this.x1;
        if(this.trace)console.log('toLogicalX:', px,'->',lx);
        return lx;
    }
    toLogicalY(py)
    {
        let ly=(py/this.my);
        if(this.trace)console.log('toLogicalY:', py,'->',ly);
        return ly;
    }
    strokeRect(ctx, x, y, w, h)
    {
        if(ctx)
        {
            ctx.strokeRect(this.toPhysicalx(x), this.toPhysicaly(y), this.toPhysicalx(w), this.toPhysicaly(h));
        }
    }
    fillRect(ctx, x, y, w, h)
    {
        if(ctx)
        {
            ctx.fillRect(this.toPhysicalx(x), this.toPhysicaly(y), this.toPhysicalx(w), this.toPhysicaly(h));
        }
    }
    moveTo(ctx, x,y)
    {
        if(ctx)
        {
            ctx.moveTo(this.toPhysicalx(x), this.toPhysicaly(y));
        }
    }
    lineTo(ctx, x, y)
    {
        if(ctx)
        {
            ctx.lineTo(this.toPhysicalx(x), this.toPhysicaly(y));
        }
    }
    lineFromTo(ctx, x1, y1, x2, y2)
    {
        // do your own ctx.beginPath(); and ctx.stroke();         
        if(ctx)
        {
            let px1=this.toPhysicalx(x1), px2=this.toPhysicalx(x2), py1=this.toPhysicaly(y1), py2 = this.toPhysicaly(py2);
            ctx.moveTo(px1, py1);
            ctx.lineTo(px2, py2);
        }
    }
}
export default CoordinateTransformer;