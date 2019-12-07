/**
 * 当点击圆环时进入历史日志信息查询
 * @param obj
 */
function gotoLog(obj){
	return;
	// var batchNo = obj.batchNo;
	// var executorId = obj.executorId;
	// var executeType = obj.executeType;
	// var jobNo= obj.jobNo;
	// location.href="tbDiMonitorLog/logInfo.action?batchNo="+batchNo+"&executorId="+executorId+"&executeType="+executeType+"&jobNo="+jobNo;
}

function Arc(){

	var arc = this;
	arc.BASIC_RING_S_A = 220;
	arc.BASIC_RING_E_A = 500;  //半环起始角度
	arc.BASIC_RING_Sf = this.getAngle(this.BASIC_RING_S_A);
	arc.BASIC_RING_Ef =this.getAngle(this.BASIC_RING_E_A);
    arc.rings = [];
    arc.basic_arc = d3.svg.arc()
                          .startAngle(this.BASIC_RING_Sf)
                          .endAngle(this.BASIC_RING_Ef)
                          .innerRadius(32)
                          .outerRadius(40);
    arc.error_arc = d3.svg.arc()
						    .startAngle(this.BASIC_RING_Sf)
						    .endAngle(this.BASIC_RING_Sf)
						    .innerRadius(32)
						    .outerRadius(40);
    arc.front_arc = d3.svg.arc()
						    .startAngle(this.BASIC_RING_Sf)
						    .endAngle(this.BASIC_RING_Sf)
						    .innerRadius(32)
						    .outerRadius(40);
    arc.ring_index = 0;

    arc.svg = d3.select("#m-svgbox").append("svg")  
                .attr("width",'100%')
                .attr("height",74)
                .attr('class','m-svg');

 
}
    //d3 rings 绘制变量

Arc.prototype.creat_ring = function(end_n,error_n,texts,errors,idn,transn,acolor,odata){   //绿色结束角度，红色结束角度，成功数，失败数，id，偏移角度，颜色,单条数据
	var obj = JSON.stringify(odata).replace(/\"/g,"'");
	var g_ring = this.svg.insert('g')
        			.attr("transform", "translate("+(100*transn)+",0)")
        			.attr('id','r'+this.ring_index)
        			.attr('style','cursor:pointer')
        			.attr('title','历史日志查询')
        			.attr("onclick","gotoLog("+obj+")");
    g_ring.append('path').attr("transform", "translate(48,44)")
            .attr('d',this.basic_arc)
            .style("fill", "#ccc");      
    var front_path = g_ring.append('path')
                .attr("transform", "translate(48,44)")
                .attr("d", this.front_arc)
                .style("fill", acolor);
    var error_arc = g_ring.append('path')
			    .attr("transform", "translate(48,44)")
			    .attr("d", this.error_arc)
			    .style("fill", "#00A65A");
    g_ring.append('text').text(texts).attr('style','font-size:28px;font-weight: bold;').attr('text-anchor','middle').attr('fill','#00A65A').attr('x','47').attr('y',52);
   // g_ring.append('line').attr('style','stroke:#009900;stroke-width:2').attr('x1','30').attr('y1','49').attr('x2','67').attr('y2','49');
    g_ring.append('text').text(errors).attr('id','text'+idn).attr('style','font-size:16px;').attr('text-anchor','middle').attr('fill','#DD6E78').attr('x','48').attr('y',73);
    var ring = {
        id : idn,
        ring_index:this.ring_index,
        front_path:front_path,
        error_arc:error_arc,
        front_arc:this.front_arc,
        endAngle:this.getAngle(this.BASIC_RING_S_A),
        text:texts,
        trans:transn,
        errors:errors,
    };
    this.rings.unshift(ring);
    $('#m-svgbox').width(this.rings.length * 100);
    this.update(ring,end_n,error_n,ring.text,ring.errors,acolor);
    //this.error(ring,end_n,ring.text,acolor);
    this.ring_index++;

}

Arc.prototype.getAngle = function(n){
    return n/360 * 2 * Math.PI;
}

Arc.prototype.update = function(ring,n,n1,text,error,acolor){     //更新指定圆环
	
	var path = ring.front_path;
	var path1 = ring.error_arc;
    var front_arc = ring.front_arc;
    var endAngle = ring.endAngle;
    var nnn = this.getAngle(n);
    var error_nnn = this.getAngle(n1);
    path.datum(nnn);
    path.transition()
          .duration(500)
          .delay(500)
          .attrTween('d',function(a){
                            var i = d3.interpolate(endAngle, a);
                            return function(t) {
                                return front_arc.endAngle(i(t))();
                            };
                        });
    
    path1.datum(error_nnn);
    path1.transition()
          .duration(500)
          .attrTween('d',function(a){
                            var i = d3.interpolate(endAngle, a);
                            return function(t) {
                                return front_arc.endAngle(i(t))();
                            };
                        });
    ring.endAngle = nnn;
    ring.text = text;
    this.svg.select('g#r'+ring.ring_index).select('text').text(text);
    if(error==0){
    	$("#text"+ring.id).hide();
    }else{
    	$("#text"+ring.id).show();
    	$("#text"+ring.id).html(error);
    }
    path.style('fill',acolor);
    path1.style('fill',"#00A65A");
    
}

Arc.prototype.removeAll = function(){
    this.svg.selectAll('g').remove();
}
// 更新所有圆环
Arc.prototype.updateAll = function(){
    for(var i=0; i<arc.rings.length; i++){
    }
    // var path = ring.front_path;
    // var front_arc = ring.front_arc;
    // var endAngle = ring.endAngle;
    // var nnn = this.getAngle(n);
    // path.datum(nnn);
    // path.transition()
    //       .duration(500)
    //       .attrTween('d',function(a){
    //                         var i = d3.interpolate(endAngle, a);
    //                         return function(t) {
    //                             return front_arc.endAngle(i(t))();
    //                         };
    //                     });
    // ring.endAngle = nnn;
    // this.svg.select('g#r'+ring.ring_index).select('text').text(ring.text);
}
Arc.prototype.update_loc = function(){
    var arcs = this;
    var rings = arcs.rings;
    if(rings.length){
        $.each(rings,function(index){
            rings[index].trans++;
            var trans = rings[index].trans;
            arcs.svg.select('g#r'+rings[index].ring_index).attr("transform", "translate("+(100*trans)+",0)");
        });
    }
}