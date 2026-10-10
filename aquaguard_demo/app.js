const reports = [
 {id:1001,location:"Science Block",type:"Broken pipe",priority:"Critical",status:"Active",description:"Flow above normal threshold",saved:0},
 {id:1002,location:"Boys Hostel",type:"Overflowing tank",priority:"High",status:"In Progress",description:"Tank overflow reported",saved:0},
 {id:1003,location:"Library",type:"Leaking tap",priority:"Normal",status:"Resolved",description:"Tap repaired by maintenance",saved:750},
 {id:1004,location:"Canteen",type:"Leaking tap",priority:"Normal",status:"Resolved",description:"Tap washer replaced",saved:500}
];
const usage=[{d:"Mon",v:3100,t:2500},{d:"Tue",v:2800,t:2500},{d:"Wed",v:3400,t:2500},{d:"Thu",v:2950,t:2500},{d:"Fri",v:3600,t:2500},{d:"Sat",v:2400,t:2200},{d:"Sun",v:2100,t:2000}];
const $=id=>document.getElementById(id);
document.querySelectorAll(".nav").forEach(btn=>btn.addEventListener("click",()=>showView(btn.dataset.view)));
function showView(view){document.querySelectorAll(".view").forEach(el=>el.classList.toggle("hidden",el.id!==view));document.querySelectorAll(".nav").forEach(el=>el.classList.toggle("active",el.dataset.view===view));}
$("quickReport").onclick=()=>showView("reports");
function badge(status){let cls=status==="Active"?"active":status==="In Progress"?"progressing":"";return `<span class="status ${cls}">${status}</span>`;}
function render(){
 const active=reports.filter(r=>r.status!=="Resolved").length,resolved=reports.length-active,saved=reports.reduce((sum,r)=>sum+r.saved,0);
 $("totalReports").textContent=reports.length;$("activeLeaks").textContent=active;$("resolvedLeaks").textContent=resolved;$("savedWater").textContent=saved.toLocaleString()+" L";$("analyticsSaved").textContent=saved.toLocaleString()+" L";$("completion").textContent=Math.round(resolved/Math.max(reports.length,1)*100)+"%";
 $("alertList").innerHTML=reports.filter(r=>r.status!=="Resolved").map(r=>`<div class="alert"><span class="alert-icon">🚨</span><div><strong>${escapeHtml(r.location)}</strong><small>${escapeHtml(r.type)} · Report #${r.id}</small></div><span class="pill red">${escapeHtml(r.priority)}</span></div>`).join("")||"<p class='muted'>No active leaks reported.</p>";
 $("locationList").innerHTML=[...new Set(reports.map(r=>r.location))].map(loc=>{let rs=reports.filter(r=>r.location===loc),done=rs.every(r=>r.status==="Resolved");return `<div class="location-card"><strong>${escapeHtml(loc)}</strong><p>${done?"All reports resolved":rs.length+" report(s) need attention"}</p><div class="progress"><span style="width:${done?100:rs.some(r=>r.status==="In Progress")?50:15}%"></span></div></div>`}).join("");
 $("reportRows").innerHTML=reports.map(r=>`<tr><td>#${r.id}</td><td>${escapeHtml(r.location)}</td><td>${escapeHtml(r.type)}</td><td>${escapeHtml(r.priority)}</td><td>${badge(r.status)}</td></tr>`).join("");
 $("maintenanceRows").innerHTML=reports.map(r=>`<tr><td>#${r.id}</td><td>${escapeHtml(r.location)}</td><td>${escapeHtml(r.type)}</td><td>${badge(r.status)}</td><td><select aria-label="Update status for report ${r.id}" onchange="updateStatus(${r.id},this.value)"><option ${r.status==="Active"?"selected":""}>Active</option><option ${r.status==="In Progress"?"selected":""}>In Progress</option><option ${r.status==="Resolved"?"selected":""}>Resolved</option></select></td></tr>`).join("");
}
function renderChart(){$("usageChart").innerHTML=usage.map(x=>`<div class="bar-group"><div class="bars"><div class="bar" title="${x.v} L" style="height:${x.v/4000*100}%"></div><div class="bar target" title="Target ${x.t} L" style="height:${x.t/4000*100}%"></div></div><small>${x.d}</small></div>`).join("");}
function updateStatus(id,status){const r=reports.find(x=>x.id===id);if(!r)return; if(status==="Resolved"&&r.status!=="Resolved"&&r.saved===0)r.saved=500;if(status!=="Resolved")r.saved=0;r.status=status;render();}
$("leakForm").addEventListener("submit",e=>{e.preventDefault();reports.unshift({id:Math.max(...reports.map(r=>r.id))+1,location:$("location").value.trim(),type:$("leakType").value,priority:$("priority").value,status:"Active",description:$("description").value.trim(),saved:0});e.target.reset();render();showView("reports");alert("Leak report submitted! (Demo only)");});
function exportCSV(){const rows=[["ID","Location","Type","Priority","Status","Description","Estimated Water Saved (L)"],...reports.map(r=>[r.id,r.location,r.type,r.priority,r.status,r.description,r.saved])];const csv=rows.map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="aquaguard-reports.csv";a.click();URL.revokeObjectURL(url);}
["reportExport","reportsExport","maintenanceExport","aiExport"].forEach(id=>$(id).addEventListener("click",()=>{exportCSV();if(id==="aiExport")$("aiMessage").textContent="CSV exported. Your Strands Harness agent can use this data to prepare a report."; }));
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
renderChart();render();
