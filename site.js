(()=>{
"use strict";
document.documentElement.classList.add("js-ready");

const script=document.currentScript||[...document.scripts].find(s=>/site\.js/.test(s.src));
const ROOT=script?new URL(".",script.src).href:new URL("./",location.href).href;
const u=p=>new URL(p,ROOT).href;
const px=id=>"https://images.pexels.com/photos/"+id+"/pexels-photo-"+id+".jpeg?auto=compress&cs=tinysrgb&w=1600";

const desktopNav=`
<div class="nav-v3">
  <div class="nav-group"><button class="nav-trigger" type="button">Mudanzas</button><div class="nav-dropdown">
    <a href="${u("mudanzas/")}">Mudanzas</a><a href="${u("mini-mudanzas/")}">Mini mudanzas</a><a href="${u("portes/")}">Portes</a><a href="${u("vaciados/")}">Vaciados</a>
  </div></div>
  <div class="nav-group"><button class="nav-trigger" type="button">Servicios</button><div class="nav-dropdown services">
    <a href="${u("pintura/")}">Pintura</a><a href="${u("parquet/")}">Parquet</a><a href="${u("limpieza/")}">Limpieza</a><a href="${u("limpieza-fin-obra/")}">Limpieza fin de obra</a>
    <a href="${u("montaje-muebles/")}">Montaje</a><a href="${u("carpinteria/")}">Carpintería</a><a href="${u("recogida-muebles/")}">Recogida muebles</a><a href="${u("retirada-escombros/")}">Escombros</a>
    <a href="${u("limpieza-jardines/")}">Jardines</a><a href="${u("limpieza-diogenes/")}">Limpiezas especiales</a><a href="${u("pequenas-reparaciones/")}">Reparaciones</a><a href="${u("reformas/")}">Puesta a punto</a>
  </div></div>
  <div class="nav-group"><button class="nav-trigger" type="button">Zonas</button><div class="nav-dropdown">
    <a href="${u("zonas/")}">Cobertura</a><a href="${u("zonas/barcelona/")}">Barcelona</a><a href="${u("zonas/hospitalet/")}">L’Hospitalet</a><a href="${u("zonas/badalona/")}">Badalona</a><a href="${u("zonas/sabadell/")}">Sabadell</a><a href="${u("zonas/terrassa/")}">Terrassa</a>
  </div></div>
  <a class="nav-link-v3" href="${u("empresas/")}">Empresas</a><a class="nav-link-v3" href="${u("equipo/")}">Equipo</a><a class="nav-link-v3" href="${u("blog/")}">Blog</a>
</div>`;

const mobileNav=`
<details><summary>Mudanzas</summary><a href="${u("mudanzas/")}">Mudanzas</a><a href="${u("mini-mudanzas/")}">Mini mudanzas</a><a href="${u("portes/")}">Portes</a><a href="${u("vaciados/")}">Vaciados</a></details>
<details><summary>Servicios</summary><a href="${u("pintura/")}">Pintura</a><a href="${u("parquet/")}">Parquet</a><a href="${u("limpieza/")}">Limpieza</a><a href="${u("limpieza-fin-obra/")}">Limpieza fin de obra</a><a href="${u("montaje-muebles/")}">Montaje</a><a href="${u("carpinteria/")}">Carpintería</a><a href="${u("recogida-muebles/")}">Recogida muebles</a><a href="${u("retirada-escombros/")}">Escombros</a><a href="${u("limpieza-jardines/")}">Jardines</a><a href="${u("limpieza-diogenes/")}">Limpiezas especiales</a><a href="${u("pequenas-reparaciones/")}">Reparaciones</a><a href="${u("reformas/")}">Puesta a punto</a></details>
<details><summary>Zonas</summary><a href="${u("zonas/")}">Cobertura</a><a href="${u("zonas/barcelona/")}">Barcelona</a><a href="${u("zonas/hospitalet/")}">L’Hospitalet</a><a href="${u("zonas/badalona/")}">Badalona</a><a href="${u("zonas/sabadell/")}">Sabadell</a><a href="${u("zonas/terrassa/")}">Terrassa</a></details>
<a href="${u("empresas/")}">Empresas</a><a href="${u("equipo/")}">Equipo</a><a href="${u("blog/")}">Blog</a>`;

document.querySelectorAll(".desktop-nav,.global-header nav").forEach(n=>n.innerHTML=desktopNav);
document.querySelectorAll(".mobile-nav,.mobile-menu").forEach(n=>n.innerHTML=mobileNav);

const subpageToggle=document.querySelector("[data-nav-toggle]");
const subpageMobile=document.querySelector(".mobile-nav");
if(subpageToggle&&subpageMobile){
  subpageToggle.addEventListener("click",()=>{
    const willOpen=subpageMobile.hidden;
    subpageMobile.hidden=!willOpen;
    subpageToggle.setAttribute("aria-expanded",String(willOpen));
    document.body.classList.toggle("mobile-nav-open",willOpen);
  });
  subpageMobile.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    subpageMobile.hidden=true;
    subpageToggle.setAttribute("aria-expanded","false");
    document.body.classList.remove("mobile-nav-open");
  }));
}

document.querySelectorAll(".faq-list details").forEach(d=>d.addEventListener("toggle",()=>{
  if(!d.open)return;
  d.closest(".faq-list")?.querySelectorAll("details").forEach(x=>{if(x!==d)x.open=false});
}));

const observer="IntersectionObserver"in window?new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add("is-visible");observer.unobserve(e.target)}
  });
},{threshold:.10,rootMargin:"0px 0px -24px 0px"}):null;
const observeReveals=()=>document.querySelectorAll(".reveal-v3").forEach(el=>observer?observer.observe(el):el.classList.add("is-visible"));

const slug=location.pathname.split("/").filter(Boolean).filter(x=>x!=="movipiso-web").pop()||"";
const serviceCfg={
  mudanzas:["Una mudanza falla cuando se olvidan los accesos.","Inventario, planta, ascensor y calle forman parte del mismo trabajo.",7203787,["Volumen","Accesos","Ruta"],[["portes","Portes",5025669],["montaje-muebles","Montaje",7203699],["piso-listo","Piso Listo",4246115]]],
  "mini-mudanzas":["Poco volumen no significa poca planificación.","Ajustamos medios al tamaño real del traslado.",7203820,["Pocas piezas","Acceso","Tiempo"],[["portes","Portes",8962877],["montaje-muebles","Montaje",6407553],["limpieza","Limpieza",7203883]]],
  portes:["Una pieza puede ser todo el problema.","Medidas, peso, escalera y carga explican más que los kilómetros.",5025512,["Medidas","Peso","Ruta"],[["mini-mudanzas","Mini mudanzas",8939563],["montaje-muebles","Montaje",6169050],["recogida-muebles","Recogida",6407553]]],
  vaciados:["Vaciar bien empieza por clasificar.","Qué sale, cuánto ocupa y por dónde baja.",4246110,["Volumen","Piezas pesadas","Salida"],[["recogida-muebles","Recogida",3791617],["limpieza","Limpieza",7203883],["piso-listo","Piso Listo",6347554]]],
  pintura:["El acabado empieza antes del rodillo.","Estado, grietas y color definen la preparación.",5691694,["Superficie","Estado","Ocupación"],[["limpieza-fin-obra","Fin de obra",6474471],["parquet","Parquet",7218001],["piso-listo","Piso Listo",5691611]]],
  parquet:["El material se ve; la base decide si dura.","Nivelación, retirada y soporte cambian el trabajo.",1388944,["Material","Base","Retirada"],[["pintura","Pintura",5767799],["montaje-muebles","Montaje",4226220],["reformas","Puesta a punto",7489125]]],
  limpieza:["Limpiar antes de tiempo es limpiar dos veces.","La limpieza funciona mejor al final de la secuencia.",9462188,["Tipo","Estado","Cristales"],[["vaciados","Vaciado",7203883],["pintura","Pintura",7218001],["piso-listo","Piso Listo",4246110]]],
  "montaje-muebles":["Una estantería y un armario no se calculan igual.","Complejidad, fijaciones y desmontaje mandan.",15016524,["Complejidad","Fijación","Desmontaje"],[["carpinteria","Carpintería",4226220],["portes","Portes",6474462],["parquet","Parquet",5767799]]],
  "pequenas-reparaciones":["Agrupar incidencias reduce visitas.","Primero listamos; después asignamos la especialidad.",6474346,["Listado","Material","Especialidad"],[["carpinteria","Carpintería",5691515],["pintura","Pintura",5691597],["piso-listo","Piso Listo",31015267]]],
  reformas:["La puesta a punto es una secuencia, no una lista de gremios.","Retirada, reparación, acabado y limpieza deben ir en orden.",5767799,["Alcance","Orden","Responsables"],[["pintura","Pintura",4263067],["parquet","Parquet",9462188],["limpieza","Limpieza",15016524]]],
  empresas:["El coste oculto está en coordinar demasiados proveedores.","Una incidencia necesita responsable, evidencia y cierre.",7217852,["Incidencia","Evidencia","Recurrencia"],[["piso-listo","Piso Listo",7218515],["hoteles-b2b","Hoteles",31015267],["mudanzas","Traslados",7489125]]],
  "piso-listo":["El gestor no quiere gremios: quiere el piso preparado.","La secuencia reduce tiempos muertos entre inquilinos.",4246110,["Llaves","Secuencia","Cierre"],[["vaciados","Vaciado",5691677],["pintura","Pintura",9462188],["limpieza","Limpieza",7489125]]],
  carpinteria:["Una puerta que roza parece pequeña hasta que bloquea una entrega.","Ajuste, reparación y montaje necesitan material, herraje y estado real.",5691515,["Material","Herrajes","Horas"],[["montaje-muebles","Montaje",15016524],["pequenas-reparaciones","Reparaciones",6474346],["piso-listo","Piso Listo",31015267]]],
  "limpieza-jardines":["Un jardín descuidado no se calcula solo por metros.","Vegetación, poda, residuos y acceso cambian completamente el trabajo.",1458694,["Superficie","Vegetación","Residuos"],[["limpieza","Limpieza",9462188],["retirada-escombros","Retirada",4246110],["empresas","Empresas",7217852]]],
  "limpieza-fin-obra":["El final de obra empieza cuando termina el último gremio.","Polvo fino, cristales y restos requieren una limpieza distinta a la doméstica.",6474462,["Metros","Restos","Cristales"],[["pintura","Pintura",5691597],["retirada-escombros","Escombros",4246110],["reformas","Puesta a punto",5767799]]],
  "recogida-muebles":["Retirar un mueble es logística, no simplemente cargarlo.","Medidas, planta y destino de retirada condicionan el servicio.",8939563,["Piezas","Acceso","Destino"],[["portes","Portes",5025512],["vaciados","Vaciados",7203788],["montaje-muebles","Montaje",15016524]]],
  "retirada-escombros":["La runa ocupa poco en plano y mucho en la operativa.","Peso, formato, planta y destino autorizado son las variables críticas.",4246110,["Volumen","Peso","Retirada"],[["limpieza-fin-obra","Fin de obra",6474462],["reformas","Puesta a punto",5767799],["vaciados","Vaciados",7203788]]],
  "limpieza-diogenes":["Aquí una calculadora cerrada sería irresponsable.","La acumulación y cualquier posible riesgo biológico exigen valoración técnica.",6195125,["Severidad","Riesgo","Protección"],[["vaciados","Vaciado",7203788],["limpieza","Limpieza",9462188],["empresas","Gestores",7217852]]],
  "hoteles-b2b":["Un hotel no puede parar para mover mobiliario.","Planificación por fases, horarios y volumen por habitación son el centro del proyecto.",7218678,["Habitaciones","Fases","Horarios"],[["empresas","Empresas",7217852],["recogida-muebles","Retirada",8939563],["piso-listo","Piso Listo",31015267]]]
};

const main=document.querySelector("main");
const calc=document.querySelector("#calculadora");
const cfg=serviceCfg[slug];
if(main&&calc&&cfg&&!document.querySelector(".benchmark-extra")){
  const challenge=document.createElement("section");
  challenge.className="benchmark-extra";
  challenge.innerHTML=`<div class="shell benchmark-split"><div class="benchmark-media reveal-v3"><img src="${px(cfg[2])}" alt="" loading="lazy"></div><div class="benchmark-copy reveal-v3"><p class="kicker">EL RETO REAL</p><h2>${cfg[0]} <span>Lo resolvemos antes de empezar.</span></h2><p>${cfg[1]}</p><div class="pain-grid">${cfg[3].map(x=>'<div class="pain-card"><strong>'+x+'</strong><span>Variable que revisamos antes de cerrar alcance.</span></div>').join("")}</div></div></div>`;
  calc.before(challenge);

  const process=document.createElement("section");
  process.className="benchmark-process";
  process.innerHTML=`<div class="shell"><div class="section-head reveal-v3"><p class="kicker">PROCESO</p><h2>Cuatro pasos. Un seguimiento.</h2></div><div class="process-track-v3">${[["01","Cuéntanos","Ubicación, alcance y fecha."],["02","Dimensionamos","Calculadora + fotos/vídeo."],["03","Validamos","Medios, acceso y orden."],["04","Ejecutamos","Trabajo y cierre."]].map(x=>'<article class="process-v3 reveal-v3"><em>'+x[0]+'</em><strong>'+x[1]+'</strong><p>'+x[2]+'</p></article>').join("")}</div></div>`;
  calc.before(process);

  const cross=document.createElement("section");
  cross.className="benchmark-cross";
  cross.innerHTML=`<div class="shell"><div class="section-head reveal-v3"><p class="kicker">SERVICIOS RELACIONADOS</p><h2>Si el trabajo no acaba aquí, <span>seguimos resolviendo.</span></h2></div><div class="cross-grid-v3">${cfg[4].map(x=>'<a class="cross-v3 reveal-v3" href="'+u(x[0]+'/')+'" style="--bg:url('+px(x[2])+')"><div><strong>'+x[1]+'</strong><span>Ver servicio →</span></div></a>').join("")}</div></div>`;
  calc.after(cross);

  const local=document.createElement("section");
  local.className="local-v3";
  local.innerHTML=`<div class="shell local-grid-v3"><div class="section-head reveal-v3"><p class="kicker">BARCELONA</p><h2>La zona orienta. <span>El acceso decide.</span></h2><p>Portal, ascensor, escaleras, calle y secuencia pueden cambiar el trabajo más que el código postal.</p></div><div class="local-points-v3">${["Acceso real","Vía pública","Edificio","Secuencia"].map(x=>'<div class="local-point-v3 reveal-v3"><strong>'+x+'</strong><span>Lo revisamos cuando afecta al alcance.</span></div>').join("")}</div></div>`;
  cross.after(local);
}

const depthCfg={
  mudanzas:["Qué incluye de verdad","Protección básica, carga, transporte y descarga se explican por escrito.",["Inventario","Acceso","Equipo","Entrega"]],
  "mini-mudanzas":["Un servicio pequeño también necesita alcance","Dimensionamos vehículo, tiempo y ayuda.",["Bultos","Ruta","Planta","Montaje"]],
  portes:["Antes de mover una pieza, medimos el problema","Medidas, peso, escalera y carga explican más que los kilómetros.",["Medidas","Peso","Giros","Ruta"]],
  vaciados:["Retirar no es abandonar","Separamos volumen, piezas especiales y destino.",["Volumen","Clasificación","Carga","Destino"]],
  pintura:["Preparación antes de pintura","Estado, reparación, protección y manos forman parte del cálculo.",["Protección","Preparación","Acabado","Limpieza"]],
  parquet:["El soporte importa tanto como el material","Retirada, nivelación y base se revisan antes.",["Material","Base","Rodapié","Muebles"]],
  limpieza:["Definimos qué significa limpio","Entrega, profunda y fin de obra son alcances distintos.",["Tipo","Estado","Cristales","Cierre"]],
  "montaje-muebles":["Complejidad antes que número de cajas","Armarios, fijaciones y desmontaje previo cambian el tiempo.",["Piezas","Complejidad","Fijación","Desmontaje"]],
  "pequenas-reparaciones":["Una lista única evita cinco visitas","Agrupamos tareas y separamos especialidades.",["Tareas","Material","Especialidad","Prioridad"]],
  reformas:["Primero secuencia, luego gremios","Retirada, reparación, acabado, limpieza y montaje deben ir en orden.",["Alcance","Orden","Dependencias","Cierre"]],
  empresas:["Trazabilidad para quien gestiona","Cada incidencia necesita responsable, evidencia y cierre.",["Entrada","Responsable","Evidencia","Cierre"]],
  "piso-listo":["La llave marca el inicio; la entrega marca el final","Piso Listo se diseña para rotación.",["Llaves","Revisión","Ejecución","Entrega"]],
  carpinteria:["Ajustar antes de sustituir","Puertas, herrajes y pequeños trabajos se diagnostican antes.",["Diagnóstico","Herraje","Ajuste","Acabado"]],
  "limpieza-jardines":["Los metros no cuentan toda la historia","Vegetación, altura, residuos verdes y acceso pesan en el trabajo.",["Superficie","Poda","Residuos","Acceso"]],
  "limpieza-fin-obra":["El polvo fino no es polvo doméstico","Restos, superficies y cristales requieren otro protocolo.",["Restos","Polvo fino","Cristales","Entrega"]],
  "recogida-muebles":["Primero decidimos el destino","Reutilización, transporte o retirada condicionan la operativa.",["Estado","Medidas","Acceso","Destino"]],
  "retirada-escombros":["Peso, volumen y legalidad","Tipo de residuo, acceso y destino deben estar claros.",["Tipo","Volumen","Carga","Destino"]],
  "limpieza-diogenes":["Valoración humana y técnica","No automatizamos precio con posible riesgo biológico.",["Seguridad","EPIs","Volumen","Protocolo"]],
  "hoteles-b2b":["Trabajar sin bloquear la operación","Fases, horarios y recorridos de servicio mandan.",["Fases","Horarios","Volumen","Continuidad"]]
};
const faq=document.querySelector(".faq-list");
const depth=depthCfg[slug];
if(depth&&faq&&!document.querySelector(".service-depth-v3")){
  const sec=document.createElement("section");
  sec.className="service-depth-v3";
  sec.innerHTML='<div class="shell depth-grid-v3"><div class="depth-copy-v3 reveal-v3"><p class="kicker">ALCANCE CLARO</p><h2>'+depth[0]+'</h2><p>'+depth[1]+'</p><a class="btn btn-blue" href="'+u("contacto/")+'">Pedir valoración →</a></div><div class="depth-list-v3">'+depth[2].map((x,i)=>'<div class="depth-item-v3 reveal-v3"><span>0'+(i+1)+'</span><strong>'+x+'</strong><small>Se valida antes de cerrar el trabajo.</small></div>').join("")+'</div></div>';
  faq.closest(".section")?.before(sec);
}

const article=document.querySelector(".article-content");
if(article&&!article.querySelector(".related-links")){
  const rel=document.createElement("aside");
  rel.className="related-links";
  rel.innerHTML='<h3>Continúa por aquí</h3><div class="related-links-grid"><a href="'+u("mudanzas-barcelona/")+'">Mudanzas Barcelona →</a><a href="'+u("precios/")+'">Precios orientativos →</a><a href="'+u("blog/")+'">Más guías →</a></div>';
  article.append(rel);
}
document.querySelectorAll(".article-content h2#faq").forEach(head=>{
  if(head.nextElementSibling?.classList?.contains("article-faq-list"))return;
  const box=document.createElement("div");box.className="article-faq-list faq-list";
  let node=head.nextElementSibling;
  while(node&&node.tagName!=="H2"){
    const next=node.nextElementSibling;
    if(node.tagName==="H3"){
      const p=next&&next.tagName==="P"?next:null;
      const d=document.createElement("details"),s=document.createElement("summary");
      s.innerHTML=node.innerHTML;d.append(s);if(p)d.append(p);
      node.remove();if(p)p.remove();box.append(d);
    }
    node=next;
  }
  head.insertAdjacentElement("afterend",box);
});

/* WhatsApp flotante global */
const wa=document.createElement("aside");
wa.className="wa-float";
wa.setAttribute("aria-label","Contacto por WhatsApp");
const pageLabel=document.querySelector("h1")?.textContent?.replace(/\s+/g," ").trim()||"Movipiso";
const msg=encodeURIComponent("Hola Jordi, quiero información sobre "+pageLabel+".");
wa.innerHTML='<button class="wa-close" type="button" aria-label="Minimizar WhatsApp">×</button><a class="wa-link" href="https://wa.me/34633881774?text='+msg+'" target="_blank" rel="noopener"><span class="wa-icon" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path d="M16 5.2A10.6 10.6 0 0 0 7 21.4L5.4 27l5.8-1.5A10.6 10.6 0 1 0 16 5.2Z"/><path d="M12.1 10.6c.3-.7.6-.7 1-.7h.5c.2 0 .4 0 .5.4l1 2.4c.1.3.1.5-.1.8l-.8 1c-.2.2-.3.4-.1.7.6 1.2 1.5 2.2 2.7 3 .3.2.6.1.8-.1l1-1.2c.2-.3.5-.3.8-.2l2.2 1c.3.1.5.2.5.5 0 .2-.1 1.5-.8 2.2-.6.7-1.5 1.1-2.6 1-1.4-.1-3.2-.8-5-2.3-2.1-1.8-3.4-4-3.8-5.4-.4-1.4.1-2.5.5-3.1.4-.5.8-.8 1.2-.9.2 0 .3-.1.5-.1Z"/></svg></span><span class="wa-copy"><strong>Contacta con Jordi</strong><small>Te respondemos en menos de 15 min</small><b>WhatsApp · 633 881 774</b></span></a>';
document.body.append(wa);
const close=wa.querySelector(".wa-close");
close.addEventListener("click",()=>{wa.classList.add("is-minimized");localStorage.setItem("movipiso-wa-min","1")});
if(localStorage.getItem("movipiso-wa-min")==="1")wa.classList.add("is-minimized");

const homeHero=document.querySelector(".hero");
if(homeHero){
  wa.classList.add("is-hidden-by-hero");
  if("IntersectionObserver"in window){
    const heroObserver=new IntersectionObserver(([entry])=>wa.classList.toggle("is-hidden-by-hero",entry.isIntersecting),{threshold:.08});
    heroObserver.observe(homeHero);
  }else{
    const check=()=>wa.classList.toggle("is-hidden-by-hero",window.scrollY<homeHero.offsetHeight*.75);
    check();addEventListener("scroll",check,{passive:true});
  }
}

observeReveals();
})();