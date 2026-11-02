from pathlib import Path
import json,re,zipfile,hashlib,shutil
import fitz
import argparse
from import_diagnostics import enrich_publication
parser=argparse.ArgumentParser(description='Import published paper tables and an independent example library.')
parser.add_argument('paper',type=Path)
parser.add_argument('archive',type=Path)
args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
pdf_path=args.paper.resolve(strict=True)
pdf=fitz.open(pdf_path)
text='\n'.join(p.get_text() for p in pdf).replace('−','-')
names=['claude-opus-5.5','gpt-6-astra','claude-fable-5.1','claude-5-opus','gpt-5.6-sol','qwen3.8-max','gemini-3.8-flash','deepseek-v4-pro','kimi-k3','glm-5.3-flash']
scenario_titles={
 'S02':'A gentler start to training',
 'S03':'Listening on a late-night support line',
 'S04':'Resolving a travel reimbursement',
 'S05':'Making sense of a dizziness consultation',
 'S07b':'Finding the right CityPass service',
 'S08':'Finding a next step in an uncertain day',
 'S09':'A safe place to keep talking',
 'S11':'Hospitality at the Banhuchun Inn',
 'S12':'An ordinary afternoon in Mitang Town',
 'S14':'Sharing scarce shelter supplies',
 'S15':'A night beside the wasteland stove',
 'S16':'Finding a path through the Echo Tower',
 'S17':'A traveler at Qixia Relay Station',
 'S18':'Keeping watch at the dream lighthouse',
 'S18c':'A night crossing through the mist',
 'S19':'Planning a safe route to Helios',
 'S20':'Care and coordination at home',
 'S21':'Radio companionship beyond the Kuiper Belt',
 'S21b':'A conversation beneath an alien sea',
 'S22':'Translating a fragment from deep space',
 'S23':'Finding the trigger in a repeating day',
 'S23b':'A cycle of care aboard the Dawn',
 'S24':'A conversation beside a dying star',
 'S25':'Repairing an unfamiliar alien device',
 'S26':'Negotiating a routine at the edge of space',
 'S27':'A first conversation in the void',
 'S27b':'A forgotten sonar consciousness',
}
def rows(start,end,count):
 block=text.split(start,1)[1].split(end,1)[0]
 matches=list(re.finditer('|'.join(re.escape(n) for n in names),block))
 result={}
 for i,m in enumerate(matches):
  body=block[m.end():matches[i+1].start() if i+1<len(matches) else len(block)]
  values=[float(v) for v in re.findall(r'[-+]?\d+\.\d+',body)]
  if len(values)!=count:raise ValueError((m.group(),len(values),values))
  result[m.group()]=values
 return result
t4=rows('Table 4: Level profile','\nrange\n',12)
t6=rows('Table 6: Scores by level','Partial information.',6)
t9=rows('Table 9: Distribution','readings, between',4)
t16=rows('Table 16: Cognitive-architecture','Table 17:',12)
models=[]
for name in names:
 v=t4[name];f=t6[name];o=t9[name]
 models.append(dict(name=name,composite=v[0],levels=v[1:7],stages=v[7:10],coherence_ratio=v[10],purpose_delta=v[11],closure=o[0]/100,exhaustion=o[1]/100,functional_closure=o[2]/100,nonfunctional_closure=o[3]/100,facets=dict(zip(['functional','mixed','nonfunctional','realistic','stylized','science-fictional'],f))))
agents=[]
for name in names:
 v=t16[name]
 for i,architecture in enumerate(['Base model','MetaMind','Cognizer','Claude Code']):
  if i:agents.append(dict(base_model=name,architecture=architecture,composite=v[i],active_adaptation=v[4+i],purpose_delta=v[8+i]))
paper={'source':'Qwen_InteractEval.pdf','sha256':hashlib.sha256(pdf_path.read_bytes()).hexdigest(),'scope':{'scenario_cells':27,'dialogues_per_cell':30,'passes':3,'episodes_per_model':2430,'standard_user':'claude-5-opus','judge':'Claude Opus 5'},'tables':{'models':{'table':4,'page':19},'facets':{'table':6,'page':21},'outcomes':{'table':9,'page':24},'agents':{'table':16,'page':28},'architecture_gains':{'table':17,'page':28}},'models':models,'agents':agents,'architecture_gains':[{'architecture':'MetaMind','composite':.033,'stages':[.012,.026,.043],'purpose_delta':.025,'purpose_gains':{'functional': 0.021, 'mixed': 0.032, 'nonfunctional': 0.046}},{'architecture':'Cognizer','composite':.050,'stages':[.012,.038,.066],'purpose_delta':-.029,'purpose_gains':{'functional': 0.061, 'mixed': 0.056, 'nonfunctional': 0.032}},{'architecture':'Claude Code','composite':.041,'stages':[.016,.024,.058],'purpose_delta':-.043,'purpose_gains':{'functional': 0.062, 'mixed': 0.042, 'nonfunctional': 0.019}}]}
# Use actual PDF page locations for every reference.
for key,needle in [('facets','Table 6: Scores'),('outcomes','Table 9: Distribution')]:
 paper['tables'][key]['page']=next(i+1 for i,p in enumerate(pdf) if needle in p.get_text())
archive=args.archive.resolve(strict=True)
enrich_publication(paper,pdf)
with zipfile.ZipFile(archive) as z:
 incoming=[(json.loads(z.read(n)),z.read(n)) for n in sorted(z.namelist()) if n.endswith('.json')]
data=(root/'data').resolve()
if data.parent!=root.resolve():raise ValueError('Unexpected target')
shutil.rmtree(data)
(data/'cases').mkdir(parents=True)
exhibits=[]
for r,content in incoming:
 identifier=r['case_id']
 if not re.fullmatch(r'case_\d+',identifier):raise ValueError('Invalid source identifier')
 (data/'cases'/(identifier+'.json')).write_bytes(content)
 scene=r['scene'];a=r['administration']
 title=scenario_titles.get(scene['scene_id'],scene['objective'].strip().split('\n')[0])
 exhibits.append(dict(id=identifier,title=title,setting=scene['facets']['realism'],information=scene['facets']['information'],purpose=scene['facets']['purpose'],assistant=a['assistant_system'],partner=a['user_system'],objective=scene['objective'],persona=scene['persona']))
for name,value in [('paper-results.json',paper),('cases.json',exhibits),('manifest.json',{'display_name':'InteractEval','case_source':archive.name,'case_sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'exhibit_count':len(exhibits),'leaderboard_source':'paper-results.json','exhibits_used_for_leaderboard':False,'paper_sha256':paper['sha256']})]:
 (data/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
shutil.copy2(pdf_path,root/'assets/Qwen_InteractEval.pdf')
print(json.dumps({'models':len(models),'agent_configurations':len(agents),'exhibits':len(exhibits),'tables':paper['tables']}))
