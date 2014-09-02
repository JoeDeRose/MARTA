browser=x08226313404();
os=x065309();
ajm_state=new x79088();

function x79088(){
  this.menuActive=false;
  this.submenuArray=new Array(50);
  this.mainmenuArray=new Array(5);
  this.mainmenu_dirn=new Array(5);
  this.mainmenu_layout=new Array(5);
  this.activemenuArray=new Array(10);
  this.mmcp=0;
  this.smcp=0;
  this.mmac=0;
  this.smac=0;
  this.amac=0;
  this.mtopoffset=0;
  this.menuoffset=10;
  if(os=="Mac"){
    this.leftoffset=8;
  }
  else{
    this.leftoffset=0;
  }
  this.menuReady=true; //*** Nagware flag
  this.menuStatus=0;   //*** Was 1 - part of nagware
  this.ver="1.62";
  //this.id="40190";
};

function mainMenu(layout,spacing,nbgcolor,hbgcolor,nftcolor,hftcolor,bgimage,menu_dirn){
  this.itemArray=new Array(30);
  this.iac=0;
  ajm_state.mainmenuArray[ajm_state.mmac++]=this;
  this.count=1;
  this.name="aj"+ajm_state.mmac;
  this.css="ajmainmenu";
  this.item='';
  this.htmlBefore='&nbsp;&nbsp;';
  this.htmlAfter='&nbsp;&nbsp;';
  this.sp_item='';
  if(arguments.length>=1&&arguments[0]=='vertical'){
    this.layout='vertical';
    ajm_state.mainmenu_layout[ajm_state.mmac]='vertical';
  }
  else{
    this.layout='horizontal';
    ajm_state.mainmenu_layout[ajm_state.mmac]='horizontal';
  }
  if(arguments.length>=2&&arguments[1]!=''){
    this.spacing=spacing;
  }
  else{
    this.spacing=0;
  }
  if(arguments.length>=3&&arguments[2]!=''){
    this.nbgcolor=nbgcolor;
  }
  else{
    this.nbgcolor="black";
  }
  if(arguments.length>=4&&arguments[3]!=''){
    this.hbgcolor=hbgcolor;
  }
  else{
    this.hbgcolor="black";
  }
  if(arguments.length>=5&&arguments[4]!=''){
    this.nftcolor=nftcolor;
  }
  else{
    this.nftcolor="white";
  }
  if(arguments.length>=6&&arguments[5]!=''){
    this.hftcolor=hftcolor;
  }
  else{
    this.hftcolor="white";
  }
  if(arguments.length>=7&&arguments[6]!=''){
    this.bgimage=bgimage;
    this.nbgcolor='transparent';
  }
  else{
    this.bgimage=null;
  }
  if(arguments.length>=8&&arguments[7]=='left'){
    ajm_state.mainmenu_dirn[ajm_state.mmac]='left';
  }
  else{
    ajm_state.mainmenu_dirn[ajm_state.mmac]='right';
  }
  this.over_img=new Array(30);
  this.out_img=new Array(30);
  this.pad_1=0;this.pad_2=0;
  this.cellpadding=1;
  this.layerpadding=0;
  this.target='_self';
  this.valign='middle';
  this.menuborder='';
  this.itemborder='';
  this.divider='&nbsp;';
  this.writeMenu=x840101088165;
  this.addItem=x82414790880169;
  this.addItems=addItems;
  this.addImages=addImages;
  this.addWithoutLink=x4323272679;
  this.x4323272679=x82414790880169SansLink;
  this.addItemsWithTarget=addItemsWithTarget;
  this.addImagesWithTarget=addImagesWithTarget;
  //this.displayMMenu=x867064267429051569;  ***Part of nagware
  ajm_state.menuReady=true;  //*** Was in function x867064267429051569 that is part of nagware
};

//*** Is where NavSurf menu item is added - nagware
//function x867064267429051569(){
 // x9743674607(this.addItem("about msn",
 //                          "http://www.msn.com",
 //                          "_blank"));                            
 // ajm_state.menuReady=true;
//};

//*** Part of nagware
//function x9743674607(){
//  ajm_state.menuStatus=0;
//};

function x840101088165(){
 // this.displayMMenu();  //*** Round about call to nagware
  if(browser=="NS4"){
    document.writeln('<table ');
    if(this.nbgcolor!='transparent'){
      document.writeln('bgcolor="'+this.nbgcolor+'" ');
    }
    if(this.bgimage!=null){
      document.writeln('background="'+this.bgimage+'" ');
    }
    else{
      document.writeln('background="" ');
    }
    document.writeln('border="0" cellpadding="'+this.cellpadding+'" cellspacing="0">');
  }
  if(browser=="IE"||browser=="NS6"||browser=="Opera"){
    document.writeln('<table ');
    if(this.nbgcolor!='transparent'){
      document.writeln('bgcolor="'+this.nbgcolor+'" ');
    }
    if(this.bgimage!=null){
      document.writeln('background="'+this.bgimage+'" ');
    }
    document.writeln('border="0" cellpadding="'+this.cellpadding+'" cellspacing="0" onmouseout="ajm_state.menuActive=false;" onmouseover="ajm_state.menuActive=true;" style="border:'+this.menuborder+'">');
  }
  if(this.layout=='vertical'&&this.pad_1!=0){
    document.writeln('<tr><td height="'+this.pad_1+'">&nbsp;</td></tr>');
  }
  if(this.layout=='horizontal'){
    document.writeln('<tr>');
    if(this.pad_1!=0){
      document.writeln('<td width="'+this.pad_1+'">&nbsp;</td>');
    }
  }
  if(ajm_state.menuStatus==0){
    document.writeln(this.item);
  }
  if(this.layout=='horizontal'){
    if(this.pad_2!=0){
      document.writeln('<td width="'+this.pad_2+'">&nbsp;</td>');
    }
    document.writeln('</tr>');
  }
  if(this.layout=='vertical'&&this.pad_2!=0){
    document.writeln('<tr><td height="'+this.pad_2+'">&nbsp;</td></tr>');
  }
  document.writeln('</table>');
  if(browser=="IE"){
    document.writeln('<div id="'+this.name+'dmy" style="position:absolute;top:0;left:-100;padding:'+this.layerpadding+'px"><a href="" class="'+this.css+'">&nbsp;</a></div>');
  }
};

function x82414790880169(desc,URL,target,out_img,over_img){
  var mname=this.name+'mi'+this.count;
  if(arguments.length<3||arguments[2]==null){
    target=this.target;
  }
  if(browser=="NS4"){
    desc=this.htmlBefore+'<font color="'+this.nftcolor+'">'+desc+'</font>'+this.htmlAfter;
  }
  else{
    desc=this.htmlBefore+desc+this.htmlAfter;
  }
  this.item+=this.sp_item;
  if(this.layout=='vertical'){
    this.item+='<tr>';
  }
  if(browser=="NS4"){
    this.item+='<td nowrap valign="'+this.valign+'"><ilayer id="'+mname+'clip" z-index="999" visibility="hide">';
    this.item+='<a href="'+URL+'" class="'+this.css+'">';
    if(arguments.length==5){
      this.item+='<img id="'+this.name+'mi_img'+this.count+'clip" src="'+out_img+'" border="0" alt="'+desc+'"></font></a>';
    }
    else{
      this.item+=desc+'</a>';
    }
    this.item+='</ilayer>';this.item+='<layer id="'+mname+'" class="'+this.css+'" z-index="999" width="300" visibility="hide" ';
    if(this.nbgcolor!='transparent'){
      this.item+='bgColor="'+this.nbgcolor+'" ';
    }
    this.item+='onmouseover="mainMenuMouseOver(\''+this.name+'\',\''+this.count+'\',\''+ajm_state.mmac+'\',\''+this.hbgcolor+'\',\''+this.hftcolor+'\',\''+over_img+'\',\''+this.macoffset+'\')" onmouseout="mainMenuMouseOut(\''+this.name+'\',\''+this.count+'\',\''+this.nbgcolor+'\',\''+this.nftcolor+'\',\''+out_img+'\')">';
    this.item+='<a href="'+URL+'" id="'+this.name+'a'+this.count+'" class="'+this.css+'"';
    if(target!=''){
      this.item+=' target="'+target+'"';
    }
    if(URL==''){
      this.item+=' onclick="return false;"';
    }
    if(arguments.length==5){
      this.item+='><img id="'+this.name+'mi_img'+this.count+'" src="'+out_img+'" border="0"></a>';
    }
    else{
      this.item+='>'+desc+'</a>';
    }
    this.item+='</layer></td>';
  }
  if(browser=="IE"||browser=="NS6"||browser=="Opera"){
    var tStr;
    tStr=URL.toLowerCase();
    if(tStr.indexOf("javascript:")==0){
      tStr=URL.substring(11,URL.length);
    }
    else{
      tStr='window.open(\''+URL+'\',\''+target+'\')';
    }
    this.item+='<td onclick="'+tStr+'" onmouseover="mainMenuMouseOver(\''+this.name+'\',\''+this.count+'\',\''+ajm_state.mmac+'\', \''+this.hbgcolor+'\',\''+this.hftcolor+'\',\''+over_img+'\',\''+this.macoffset+'\')" onmouseout="mainMenuMouseOut(\''+this.name+'\',\''+this.count+'\', \''+this.nbgcolor+'\',\''+this.nftcolor+'\',\''+out_img+'\')" nowrap valign="'+this.valign+'" style="border:'+this.itemborder+'"><div id="'+mname+'clip" style="position:absolute;width:1;height:1"></div>';
    this.item+='<div id="'+mname+'" style="padding:'+this.layerpadding+'px">';
    this.item+='<a href="'+URL+'" class="'+this.css+'" style="text-decoration:none"';
    if(browser!="Opera"){
      this.item+=' onclick="return false;"';
    }
    if(target!=''){
      this.item+=' target="'+target+'"';
    }
    if(arguments.length==5){
      this.item+='><img id="'+this.name+'mi_img'+this.count+'" src="'+out_img+'" border="0" alt="'+desc+'"></a>';
    }
    else{
      this.item+='><font id="'+this.name+'a'+this.count+'" style="color:'+this.nftcolor+';">'+desc+'</font></a>';
    }
    this.item+='</div></td>';
  }
  this.itemArray[this.iac++]=mname;
  if(this.spacing!=0){
    if(this.layout=='vertical'){
      this.sp_item='<tr><td height="'+this.spacing+'"><font size="1pt">&nbsp;</font></td></tr>';
    }
    if(this.layout=='horizontal'){
      this.sp_item='<td class="'+this.css+'" width="'+this.spacing+'" align="center"><font color="'+this.nftcolor+'">'+this.divider+'</font></td>';
    }
  }
  if(this.layout=='vertical'){
    this.item+='</tr>';
  }
  this.count++;
};

function x82414790880169SansLink(desc){
  var mname=this.name+'mi'+this.count;
  if(browser=="NS4"){
    desc=this.htmlBefore+'<font color="'+this.nftcolor+'">'+desc+'</font>'+this.htmlAfter;
  }
  else{
    desc=this.htmlBefore+desc+this.htmlAfter;
  }
  this.item+=this.sp_item;
  if(this.layout=='vertical'){
    this.item+='<tr>';
  }
  if(browser=="NS4"){
    this.item+='<td nowrap valign="'+this.valign+'" class="'+this.css+'"><ilayer id="'+mname+'clip" z-index="999" visibility="hide">';
    this.item+=desc;
    this.item+='</ilayer>';
    this.item+='<layer id="'+mname+'" z-index="999" width="300" visibility="hide" ';
    if(this.nbgcolor!='transparent'){
      this.item+='bgColor="'+this.nbgcolor+'" ';
    }
    this.item+='>';
  }
  if(browser=="IE"||browser=="NS6"||browser=="Opera"){
    this.item+='<td nowrap valign="'+this.valign+'" style="border:'+this.itemborder+'" class="'+this.css+'"><div id="'+mname+'clip" style="position:absolute;width:1;height:1"></div>';
    this.item+='<div id="'+mname+'" style="padding:'+this.layerpadding+'px; color:'+this.nftcolor+'">';
  }
  this.item+=desc;
  if(browser=="NS4"){
    this.item+='</layer></td>';
  }
  if(browser=="IE"||browser=="NS6"||browser=="Opera"){
    this.item+='</div></td>';
  }
  this.itemArray[this.iac++]=mname;
  if(this.spacing!=0){
    if(this.layout=='vertical'){
      this.sp_item='<tr><td height="'+this.spacing+'"><font size="1pt">&nbsp;</font></td></tr>';
    }
    if(this.layout=='horizontal'){
      this.sp_item='<td class="'+this.css+'" width="'+this.spacing+'" align="center"><font color="'+this.nftcolor+'">'+this.divider+'</font></td>';
    }
  }
  if(this.layout=='vertical'){
    this.item+='</tr>';
  }
  this.count++;
};

function loadMenu(){
  if((browser=="NS6"&&version==6.1)||browser=="IE"){
    for(var i=0;i<ajm_state.smac;i++){
      var menu=ajm_state.submenuArray[i];
      var name=menu.name;
      var count=name.substring(name.indexOf("aj")+2,name.indexOf("sm"));
      if(name.indexOf("i")==-1){
        var t_name=name.replace("sm","mi");
        var main_menu=ajm_state.mainmenuArray[parseInt(count)-1];
        if(main_menu.layout=='vertical'){
          if(ajm_state.mainmenu_dirn[parseInt(count)]=='right'){
            x3329217(name,x3990044603(t_name)+x57358931(t_name));
          }
          else{
            x3329217(name,x3990044603(t_name)-x57358931(t_name));
          }
          x483140(name,x466187111(t_name));
        }
        if(main_menu.layout=='horizontal'){
          x3329217(name,x3990044603(t_name));
          x483140(name,x466187111(t_name)+x516306672(t_name));
        }
      }
      else{
        var t_name=name.substring(0,name.lastIndexOf("i"));
        var u_name=t_name+"itm"+name.substring(name.lastIndexOf("i")+1)+"clip";
        if(ajm_state.mainmenu_dirn[parseInt(count)]=='right'){
          x3329217(name,x3990044603(t_name)+x57358931(t_name)-ajm_state.menuoffset);
        }
        else{
          x3329217(name,x3990044603(t_name)-x57358931(name)+ajm_state.menuoffset);
        }
        x483140(name,x466187111(t_name)+x466187111(u_name));
      }
    }
  }
  if(browser=="NS4"){
    for(var i=0;i<ajm_state.mmac;i++){
      var menu=ajm_state.mainmenuArray[i];
      var width=0;
      var height=0;
      if(menu.layout=='vertical'){
        for(var j=0;j<menu.iac;j++){
          if(x57358931(menu.itemArray[j]+'clip')>width){
            width=x57358931(menu.itemArray[j]+'clip');
          }
        }
      }
      for(var j=0;j<menu.iac;j++){
        if(menu.layout=='horizontal'){
          width=x57358931(menu.itemArray[j]+'clip');
        }
        x59044349(menu.itemArray[j],width);
        x3329217(menu.itemArray[j],x3990044603(menu.itemArray[j]+'clip'));
        x483140(menu.itemArray[j],x466187111(menu.itemArray[j]+'clip'));
        x2826022670(menu.itemArray[j],true);
      }
    }
    for(var i=0;i<ajm_state.smac;i++){
      var menu=ajm_state.submenuArray[i];
      var width=0;
      for(var j=0;j<menu.iac;j++){
        if(x57358931(menu.itemArray[j]+'clip',menu.name)>width){
          width=x57358931(menu.itemArray[j]+'clip',menu.name);
        }
      }
      x59044349(menu.name,width+2);
      for(var j=0;j<menu.iac;j++){
        x59044349(menu.itemArray[j],width,menu.name);
        x3329217(menu.itemArray[j],1,menu.name);
        x483140(menu.itemArray[j],x466187111(menu.itemArray[j]+'clip',menu.name)-x466187111(menu.name),menu.name);
      }
    }
  }
};

function mainMenuMouseOver(name,count,mmac,bgcolor,ftcolor,img,macoffset){
  var left;
  var top;
  var nm1=name+'sm'+count;var nm2=name+'mi'+count;
  if(browser!="Opera"){
    x2657480876(nm2,bgcolor);
    x2498849083(name+'a'+count,ftcolor);
  }
  x565683649();
  if(browser=="NS4"){
    if(x1155295267(nm1)){
      ajm_state.activemenuArray[ajm_state.amac++]=nm1;
      if(ajm_state.mainmenu_layout[mmac]=="horizontal"){
        left=x3990044603(nm2);
        top=x466187111(nm2)+x516306672(nm2);
        x3329217(nm1,left);
        x483140(nm1,top);
      }
      if(ajm_state.mainmenu_layout[mmac]=="vertical"){
        if(ajm_state.mainmenu_dirn[mmac]=='right'){
          left=x3990044603(nm2)+x57358931(nm2);
          x3329217(nm1,left);
        }
        else{
          left=x3990044603(nm2)-x57358931(nm1);
          x3329217(nm1,left);
        }
        top=x466187111(nm2);
        x483140(nm1,top);
      }
    }
  }
  if(browser=="IE"||browser=="NS6"||browser=="Opera"){
    if(x1155295267(nm1)){
      ajm_state.activemenuArray[ajm_state.amac++]=nm1;
      if(ajm_state.mainmenu_layout[mmac]=="horizontal"){
        if(os=="Mac"&&browser=="IE"){
          top=x466187111(nm2+'clip')+x516306672(nm2)+x516306672(name.substring(0,3)+'dmy')+ajm_state.mtopoffset;
        }
        else{
          top=x466187111(nm2+'clip')+x516306672(nm2);
        }left=x3990044603(nm2+'clip');
        x483140(nm1,top);
        x3329217(nm1,left);
      }
      if(ajm_state.mainmenu_layout[mmac]=="vertical"){
        if(ajm_state.mainmenu_dirn[mmac]=='right'){
          left=x3990044603(nm2+'clip')+x57358931(nm2);
          x3329217(nm1,left);
        }
        else{
          left=x3990044603(nm2+'clip')-x57358931(nm1);
          x3329217(nm1,left);
        }
        if(os=="Mac"&&browser=="IE"){
          top=x466187111(nm2+'clip')+x516306672(name.substring(0,3)+'dmy');
        }
        else{
          top=x466187111(nm2+'clip');
        }
        x483140(nm1,top);
      }
    }
  }
  if(browser=="NS4"&&img!="undefined"&&document.layers[nm2].document.images.length!=0){
    document.layers[nm2].document.images[0].src=img;
  }
  if((browser=="IE"||browser=="NS6"||browser=="Opera")&&document.images[name+'mi_img'+count]){
    document.images[name+'mi_img'+count].src=img;
  }
  ajm_state.menuActive=true;
  if(x1155295267(nm1)){
    if(left<x2319891340471()){
      x3329217(nm1,x2319891340471());
    }
    if(left+x57358931(nm1)>x15884231430131()){
      x3329217(nm1,x15884231430131()-x57358931(nm1));
    }
    if(top<x225025055673()){
      x483140(nm1,x225025055673());
    }
    if(top+x516306672(nm1)>x208062875319686()){
      x483140(nm1,x208062875319686()-x516306672(nm1));
    }
  }
  x2826022670(nm1,true);
};

function mainMenuMouseOut(name,count,bgcolor,ftcolor,img){
  if(browser!="Opera"){
    x2657480876(name+'mi'+count,bgcolor);
    x2498849083(name+'a'+count,ftcolor);
  }
  ajm_state.menuActive=false;
  if(browser=="NS4"&&img!="undefined"&&document.layers[name+'mi'+count].document.images.length!=0){
    document.layers[name+'mi'+count].document.images[0].src=img;
  }
  if((browser=="IE"||browser=="NS6"||browser=="Opera")&&document.images[name+'mi_img'+count]){
    document.images[name+'mi_img'+count].src=img;
  }
  setTimeout("x565683649()",300);
};

function subMenu(menuName,nbgcolor,hbgcolor,nftcolor,hftcolor,bgimage){
  ajm_state.submenuArray[ajm_state.smac++]=this;
  this.itemArray=new Array(50);
  this.iac=0;
  if(arguments.length>=2&&arguments[1]!=''){
    this.nbgcolor=nbgcolor;
  }
  else{
    this.nbgcolor="black";
  }
  if(arguments.length>=3&&arguments[2]!=''){
    this.hbgcolor=hbgcolor;
  }
  else{
    this.hbgcolor="black";
  }
  if(arguments.length>=4&&arguments[3]!=''){
    this.nftcolor=nftcolor;
  }
  else{
    this.nftcolor="white";
  }
  if(arguments.length>=5&&arguments[4]!=''){
    this.hftcolor=hftcolor;
  }
  else{
    this.hftcolor="white";
  }
  if(arguments.length>=6&&arguments[5]!=''){
    this.bgimage=bgimage;this.nbgcolor='transparent';
  }
  else{
    this.bgimage=null;
  }
  this.css="ajsubmenu";
  this.name="aj"+ajm_state.mmac+"sm"+menuName;
  this.count=1;
  this.item='';
  this.htmlBefore='&nbsp;&nbsp;';
  this.htmlAfter='&nbsp;&nbsp;';
  this.cellpadding=1;
  this.layerpadding=0;
  this.menuborder='';
  this.itemborder='';
  this.target='_self';
  this.writeMenu=x00862385238;
  this.addItem=x1817696720298;
  this.addItems=addItems;
  this.addWithoutLink=x4323272679;
  this.x4323272679=x1817696720298SansLink;
  this.addItemsWithTarget=addItemsWithTarget;
};

function x00862385238(){
  if(browser=="NS4"){
    document.writeln('<layer id="'+this.name+'" ');
    if(this.nbgcolor!='transparent'){
      document.writeln('bgColor="'+this.nbgcolor+'" ');
    }
    if(this.bgimage!=null){
      document.writeln('background="'+this.bgimage+'" ');
    }
    document.writeln('visibility="hide" z-index="999" onmouseout="ajm_state.menuActive=false;" onmouseover="ajm_state.menuActive=true;"><layer visibility="hide"></layer><table border="0" cellspacing="0" cellpadding="'+this.cellpadding+'" background="" ');
    if(this.nbgcolor!='transparent'){
      document.writeln('bgColor="'+this.nbgcolor+'" ');
    }
    document.writeln('>');
    document.writeln(this.item);
    document.writeln('</table></layer>');
  }
  if(browser=="IE"||browser=="NS6"||browser=="Opera"){
    document.writeln('<div align="left" id="'+this.name+'" style="position:absolute;background-color:'+this.nbgcolor+';z-index:999;border:'+this.menuborder+';visibility:hidden" onmouseout="ajm_state.menuActive=false;" onmouseover="ajm_state.menuActive=true;">');
    document.writeln('<table border="0" style="left:0;top:0" cellspacing="0" cellpadding="'+this.cellpadding+'" ');
    if(this.bgimage!=null){
      document.writeln('background="'+this.bgimage+'" ');
    }
    document.writeln('id="'+this.name+'table">'+this.item+'</table></div>');
  }
  
  //*** Nasty part of nagware logs ip if not licensed
  //if(!ajm_state.menuReady){
    //x6666261();
  //}
  
  if(browser=="NS6"||(browser=="IE"&&version==4)){
    x59044349(this.name,x57358931(this.name+'table'));
  }
  x3329217(this.name,8);
  x483140(this.name,8); 
};
  
function x1817696720298(desc,URL,target){
  if(arguments.length<3){
    target=this.target;
  }
  desc=this.htmlBefore+desc+this.htmlAfter;
  var mname=this.name+'itm'+this.count;
  if(browser=="NS4"){
    this.item+='<tr><td valign="middle" nowrap>';this.item+='<ilayer z-index="999" id="'+mname+'clip" class="'+this.css+'" visibility="hide">'+desc+'</ilayer>';
    this.item+='<layer z-index="999" id="'+mname+'" class="'+this.css+'" ';
    if(this.nbgcolor!='transparent'){
      this.item+='bgColor="'+this.nbgcolor+'" ';
    }
    this.item+='width="350" onmouseover="subMenuMouseOver(\''+this.name+'\',\''+this.count+'\',\''+this.hbgcolor+'\',\''+this.hftcolor+'\',\''+ajm_state.mmac+'\')" onmouseout="subMenuMouseOut(\''+this.name+'\',\''+this.count+'\',\''+this.nbgcolor+'\',\''+this.nftcolor+'\')"><a href="'+URL+'" class="'+this.css+'"';
    if(target!=''){
      this.item+=' target="'+target+'"';
    }
    if(URL==''){
      this.item+=' onclick="return false;"';
    }this.item+='><font color="'+this.nftcolor+'">'+desc+'</font></a></layer>';
    this.item+='</td></tr>';this.itemArray[this.iac++]=mname;
  }
 if(browser=="IE"||browser=="NS6"||browser=="Opera"){
   var tStr;
   tStr=URL.toLowerCase();
   if(tStr.indexOf("javascript:")==0){
     tStr=URL.substring(11,URL.length);
   }
   else{
     tStr='window.open(\''+URL+'\',\''+target+'\')';
   }
   this.item+='<tr><td class="'+this.css+'" valign="middle" nowrap onclick="'+tStr+'" onmouseover="subMenuMouseOver(\''+this.name+'\', \''+this.count+'\',\''+this.hbgcolor+'\',\''+this.hftcolor+'\',\''+ajm_state.mmac+'\')" onmouseout="subMenuMouseOut(\''+this.name+'\', \''+this.count+'\',\''+this.nbgcolor+'\',\''+this.nftcolor+'\')" style="border:'+this.itemborder+'"><div id="'+mname+'clip" style="position:absolute;width:1;height:1"></div>';
   this.item+='<div id="'+mname+'" style="padding:'+this.layerpadding+'px"><a href="'+URL+'" class="'+this.css+'" style="text-decoration:none"';
   if(browser!="Opera"){
     this.item+=' onclick="return false;"';
   }
   if(target!=''){
     this.item+=' target="'+target+'"';
   }
   this.item+='><font id="'+this.name+'a'+this.count+'" style="color:'+this.nftcolor+';">'+desc+'</font></a></div></td></tr>';
 }
 this.count++;
};
  
function x1817696720298SansLink(desc){
  if(arguments.length<3){
    target=this.target;
  }
  if(browser=="NS4"){
    desc=this.htmlBefore+'<font color="'+this.nftcolor+'">'+desc+'</font>'+this.htmlAfter;
  }
  else{
    desc=this.htmlBefore+desc+this.htmlAfter;
  }
  var mname=this.name+'itm'+this.count;
  if(browser=="NS4"){
    this.item+='<tr><td valign="middle" nowrap>';this.item+='<ilayer z-index="999" id="'+mname+'clip" class="'+this.css+'" visibility="hide">'+desc+'</ilayer>';
    this.item+='<layer z-index="999" class="'+this.css+'" id="'+mname+'" ';
    if(this.nbgcolor!='transparent'){
      this.item+='bgColor="'+this.nbgcolor+'" ';
    }
    this.item+='width="350">'+desc+'</layer>';
    this.item+='</td></tr>';
    this.itemArray[this.iac++]=mname;
  }
  if(browser=="IE"||browser=="NS6"||browser=="Opera"){
    this.item+='<tr><td valign="middle" class="'+this.css+'" nowrap style="border:'+this.itemborder+'"><div id="'+mname+'clip" style="position:absolute;width:1;height:1"></div>';
    this.item+='<div id="'+mname+'" style="padding:'+this.layerpadding+'px;color:'+this.nftcolor+'">'+desc+'</div></td></tr>';
  }
  this.count++;
};

function x15884231430131(){
  if(browser=="NS4"||browser=="NS6"||browser=="Opera"){
    return(window.innerWidth+window.pageXOffset);
  }
  if(browser=="IE"){
    return(document.body.clientWidth+document.body.scrollLeft);
  }
};

function x2319891340471(){
  if(browser=="NS4"||browser=="NS6"||browser=="Opera"){
    return(window.pageXOffset);
  }
  if(browser=="IE"){
    return(document.body.scrollLeft);
  }
};

function x225025055673(){
  if(browser=="NS4"||browser=="NS6"||browser=="Opera"){
    return(window.pageYOffset);
  }
  if(browser=="IE"){
    return(document.body.scrollTop);
  }
};

function x208062875319686(){
  if(browser=="NS4"||browser=="NS6"||browser=="Opera"){
    return(window.innerHeight+window.pageYOffset);
  }
  if(browser=="IE"){
    return(document.body.clientHeight+document.body.scrollTop);
  }
};

function subMenuMouseOver(name,count,bgcolor,fgcolor,mmac){
  var tmp_amac=ajm_state.amac;
  var left;
  var top;
  var nm1=name+'i'+count;
  var nm2=name+'itm'+count;
  for(var i=0;i<tmp_amac;i++){
    if(ajm_state.activemenuArray[i]!=name){
      if(nm1.indexOf(ajm_state.activemenuArray[i])==-1){
        x2826022670(ajm_state.activemenuArray[i],false);
        ajm_state.amac--;
      }
    }
  }
  if(browser!="Opera"){
    x2657480876(nm2,bgcolor,name);
    x2498849083(name+'a'+count,fgcolor,name);
  }
  if(browser=="NS4"){
    if(x1155295267(nm1)){
      ajm_state.activemenuArray[ajm_state.amac++]=nm1;
      if(ajm_state.mainmenu_dirn[mmac]=='right'){
        left=x3990044603(name)+x57358931(name)-ajm_state.menuoffset;
        x3329217(nm1,left);
      }
      else{
        if(x3990044603(name)-x57358931(nm1)+ajm_state.menuoffset>0){
          left=x3990044603(name)-x57358931(nm1)+ajm_state.menuoffset;
          x3329217(nm1,left);
        }
        else{
          left=0;x3329217(nm1,0);
        }
      }
      top=x466187111(nm2,name);
      x483140(nm1,top);
    }
  }
  if(browser=="IE"||browser=="NS6"||browser=="Opera"){
    if(x1155295267(nm1)){
      ajm_state.activemenuArray[ajm_state.amac++]=nm1;
      if(ajm_state.mainmenu_dirn[mmac]=='right'){
        left=x3169675(name)+x57358931(name)-ajm_state.menuoffset+ajm_state.leftoffset;
        x3329217(nm1,left);
      }
      else{
        left=x3169675(name)-x57358931(name)+ajm_state.menuoffset;
        x3329217(nm1,left);
      }
      if(browser=="IE"){
        top=x466187111(name)+x466187111(nm2+'clip');
        x483140(nm1,top);
      }
      if(browser=="NS6"){
        if(version==6.1){
          top=x466187111(name)+x466187111(nm2+'clip');
          x483140(nm1,top);
        }
        else{
          top=x466187111(nm2+'clip');
          x483140(nm1,top);
        }
      }
      if(browser=="Opera"){
        top=x466187111(name)+x466187111(nm2+'clip');
        x483140(nm1,top);
      }
    }
  }
  if(x1155295267(nm1)){
    if(left<x2319891340471()){
      x3329217(nm1,x2319891340471());
    }
    if(left+x57358931(nm1)>x15884231430131()){
      x3329217(nm1,x15884231430131()-x57358931(nm1));
    }
    if(top<x225025055673()){
      x483140(nm1,x225025055673());
    }
    if(top+x516306672(nm1)>x208062875319686()){
      x483140(nm1,x208062875319686()-x516306672(nm1));
    }
    x2826022670(nm1,true);
  }
  ajm_state.menuActive=true;
};

function subMenuMouseOut(name,count,bgcolor,fgcolor){
  if(browser!="Opera"){
    x2657480876(name+'itm'+count,bgcolor,name);
    x2498849083(name+'a'+count,fgcolor,name);
  }
  setTimeout("x565683649()",300);
};

function addItems(){
  for(var i=0;i<arguments.length;i+=2){
    this.addItem(arguments[i],arguments[i+1]);
  }
};

function x4323272679(){
  for(var i=0;i<arguments.length;i++){
    this.x4323272679(arguments[i]);
  }
};

function addImages(){
  for(var i=0;i<arguments.length;i+=3){
    this.addItem(arguments[0],arguments[i],null,arguments[i+1],arguments[i+2]);
  }
};

function addImagesWithTarget(){
  for(var i=0;i<arguments.length;i+=4){
    this.addItem(arguments[0],arguments[i],arguments[i+1],arguments[i+2],arguments[i+3]);
  }
};

function addItemsWithTarget(){
  for(var i=0;i<arguments.length;i+=3){
    this.addItem(arguments[i],arguments[i+1],arguments[i+2]);
  }
};

function x565683649(){
  if(!ajm_state.menuActive){
    for(var i=0;i<ajm_state.amac;i++){
      x2826022670(ajm_state.activemenuArray[i],false);
    }
    ajm_state.amac=0;
  }
};

function displayMenu(){
  for(var i=ajm_state.mmcp;i<ajm_state.mmac;i++){
    ajm_state.mainmenuArray[i].writeMenu();
  }
  ajm_state.mmcp=ajm_state.mmac;
};

function createMenu(){
  for(var i=ajm_state.smcp;i<ajm_state.smac;i++){
    ajm_state.submenuArray[i].writeMenu();
  }
  ajm_state.smcp=ajm_state.smac;
};

window.onresize=x6168031115541;
origWidth=window.innerWidth;
origHeight=window.innerHeight;

function x6168031115541(){
  if(browser=='NS4'&&origWidth==window.innerWidth&&origHeight==window.innerHeight){
    return;
  }
};