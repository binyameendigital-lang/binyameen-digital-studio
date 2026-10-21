import { getStore } from "@netlify/blobs";
const STORE = "binyameen-feedback"; const KEY = "submissions.json";
const headers = { "Content-Type":"application/json; charset=utf-8", "Cache-Control":"no-store", "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Methods":"GET, POST, OPTIONS", "Access-Control-Allow-Headers":"Content-Type, Authorization" };
const json=(statusCode,body)=>new Response(JSON.stringify(body),{status:statusCode,headers});
function authorized(request, body={}) { const supplied=(request.headers.get("authorization")||"").replace(/^Bearer\s+/i,"") || body.password || ""; const expected=process.env.ADMIN_PASSWORD || ""; return expected.length>=12 && supplied===expected; }
export default async request => {
 if(request.method==="OPTIONS") return new Response(null,{status:204,headers});
 if(!["GET","POST"].includes(request.method)) return json(405,{error:"Method not allowed."});
 let body={}; if(request.method==="POST"){try{body=await request.json()}catch{return json(400,{error:"Invalid JSON."})}}
 if(!authorized(request,body)) return json(401,{error:"Admin password is incorrect or ADMIN_PASSWORD is not configured (minimum 12 characters)."});
 const store=getStore(STORE);
 try {
  const all=(await store.get(KEY,{type:"json"}))||[];
  if(request.method==="GET") return json(200,{feedback:all});
  const idx=all.findIndex(x=>x.id===body.id); if(idx<0) return json(404,{error:"Feedback not found."});
  if(body.action==="approve") all[idx].status="approved";
  else if(body.action==="reject") all[idx].status="rejected";
  else if(body.action==="delete") all.splice(idx,1);
  else return json(400,{error:"Unknown action."});
  if(body.action!=="delete" && all[idx]) all[idx].updatedAt=new Date().toISOString();
  await store.setJSON(KEY,all); return json(200,{ok:true,feedback:all});
 } catch(error){console.error("Admin feedback action failed",error);return json(500,{error:"Could not update feedback."})}
};
