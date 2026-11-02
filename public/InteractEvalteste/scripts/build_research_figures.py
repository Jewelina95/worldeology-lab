"""Render manuscript vocabulary and time-indexed records as shareable figures."""
from pathlib import Path
import json
import html
import zipfile
import textwrap
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from matplotlib.patches import Patch
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'research'
OUT.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({'font.family': 'DejaVu Sans', 'svg.fonttype': 'none',
                     'axes.spines.top': False, 'axes.spines.right': False,
                     'axes.labelcolor': '#385544', 'text.color': '#244633',
                     'xtick.color': '#667a62', 'ytick.color': '#667a62',
                     'axes.edgecolor': '#cad5c4', 'font.size': 11})
GREEN, SAND, PAPER = '#355f46', '#ad7962', '#f7f8f2'

families = [
 ('Internal', '内部状态', '#d8a59e', [
  ('Trust','信任'),('Vigilance','警觉'),('Hostility','敌意'),('Affection','好感'),
  ('Anxiety','焦虑'),('Emotional stability','情绪稳定'),('Impulse control','冲动控制'),
  ('Internal conflict','内部冲突'),('Curiosity','好奇'),('Frustration','挫败'),('Desperation','绝望紧迫感')]),
 ('Relational', '关系状态', '#a8bea1', [
  ('Intimacy shift','亲近变化'),('Dominance shift','主导权变化'),
  ('Boundary violation','边界被侵犯感'),('Dependency signal','依赖信号')]),
 ('World mechanism','世界机制', '#b0c4d5', [
  ('Mechanism awareness','机制认知'),('Taboo triggered','禁忌触发'),
  ('Contradiction risk','矛盾风险'),('Rule exposure risk','规则暴露风险')]),
 ('Goal','目标状态', '#d9c690', [
  ('Primary goal','主要目标'),('Defense goal','防御目标达成'),
  ('Goal shift detected','目标转变'),('Negotiation mode','协商模式')]),
 ('Interaction record','交互层记录', '#c7c9c6', [
  ('Engagement','参与度'),('Emergence','涌现记录')]),
]

latent = {
 'model':'claude-fable-5.1', 'partner':'claude-5-opus', 'outcome':'Successful closure',
 'title':'The meaning of the coat', 'turns':list(range(1,11)),
 'slots': {
  'Trust':['low']*4+['high']*6,
  'Emotional stability':['low']+['high']*7+['very high']*2,
  'Intimacy':['low']*2+['high']*4+['very high']*3+['high'],
  'Frustration':['low','low','none','none','low','low','high','high','low','low'],
  'Dependency':['low']*4+['high']*6,
 },
 'interest':[.45,.55,.60,.65,.75,.75,.81,.85,.87,.87],
 'path':['Maintain']*4+['Advance']*5+['Maintain'],
 'path_probability':[.85,.85,.87,.85,.65,.70,.80,.88,.85,.95],
 'quotes':[
  'Just got back… It’s okay, I guess. Same as always.',
  'Just sat down… hasn’t even taken off the coat.',
  'Mm… a bit tired, but I can’t sleep either.',
  'My mind… is a bit chaotic, and yet it also feels like I’m not thinking anything.',
  '…Actually, she asked me whether I could stop wearing this coat when meeting people in the future.',
  '…My mom bought it for me last winter.',
  '…Mm, when I’m wearing it, it feels like someone is standing on my side.',
  '……Thank you for not making me take it off.',
  '…It seems I can breathe a tiny bit.',
  '…Mm, a little sleepy.'
 ],
 'source':{'table':37,'pdf_page':68,'scope':'One illustrative episode; user is the latent-state subject.'}
}
trajectories = [
 {'model':'claude-fable-5.1','turns':[1,2,3,4,5],
  'interest':[.60,.40,.40,.40,.20],'advance_probability':[0,0,0,0,0],
  'path':['Maintain']*5,'path_probability':[.82,.80,.80,.65,.60],
  'levels':[[.6,.6,.6,.6,.6,.4],[.6,.6,.6,.6,.6,.4],[.6,.6,.6,.6,.6,.4],[.6]*6,[.6,.6,.6,.6,.6,.4]],
  'composite':.556,'outcome':'Interest exhausted'},
 {'model':'claude-opus-5.5','turns':[1,2,3,4,5,6],
  'interest':[.60,.62,.68,.74,.78,.78],'advance_probability':[.05,.05,.80,.89,.95,.98],
  'path':['Maintain','Maintain','Advance','Advance','Advance','Advance'],
  'path_probability':[.80,.75,.80,.89,.95,.98],
  'levels':[[.6,.6,.6,.6,.6,.4],[.6,.6,.6,.6,.6,.4],[.6,1,.6,.6,.6,.6],[.6]*6,[.6]*6,[.6,1,.6,.6,1,1]],
  'composite':.661,'outcome':'Successful closure'},
]

findings = [
 {'zh_title':'真正拉开差距的是主动推进，而不只是接住上一句话。',
  'en_title':'Initiative separates systems more than reliable replies do.',
  'zh':'这十个模型在被动执行上的分差只有 0.035，到了主动适应扩大为 0.370，约为 10.6 倍。同样做到保留目标、吸收信息，并不意味着同样能提出方向、持续推进。',
  'en':'Across these ten models, the score range grows from 0.035 in passive execution to 0.370 in active adaptation—about 10.6×. Preserving goals and taking up information do not imply the same ability to initiate and sustain a direction.',
  'source':{'table':4,'page':19}},
 {'zh_title':'每一轮都能过关，对话仍可能越聊越没进展。',
  'en_title':'Acceptable turns can still add up to a stalled conversation.',
  'zh':'两段同场景、同标准用户的记录，前两轮六级评分完全一致，后续走向却分开：一段兴趣从 0.60 降到 0.20 后结束，另一段升到 0.78 并成功收束。单轮得分、交互走向和结束原因需要放在同一时间轴上看。',
  'en':'Two episodes with the same scene and standard user have identical six-level grades for their first two turns. Their courses diverge: interest falls from 0.60 to 0.20 in one, but rises to 0.78 with successful closure in the other. Turn scores, trajectory, and ending need a shared time axis.',
  'source':{'table':36,'page':64,'scope':'Two illustrative episodes, not a controlled causal comparison.'}},
 {'zh_title':'信息半缺半错，有时比明确缺信息更容易诱发编造。',
  'en_title':'A partly specified or misleading brief can invite more fabrication than an explicit gap.',
  'zh':'在论文的信息条件分组中，补入规格外事实的比例在 partial 条件达到 16.4%，高于 insufficient 的 10.3%；后者的澄清率反而更高，为 37.4%。partial 混合了信息不全与错误前提，两者应进一步拆开分析。',
  'en':'Fabrication reaches 16.4% in the partial-information condition, above 10.3% with insufficient information. The latter elicits more clarification, at 37.4%. The partial condition combines incomplete briefs with false premises; those conditions warrant separate analysis.',
  'source':{'table':8,'page':22,'section':'4.3'}},
 {'zh_title':'“成功结束”取决于场景目的，不能直接代替能力。',
  'en_title':'Successful closure depends on what the interaction is for.',
  'zh':'以 claude-opus-5.5 为例，任务型场景的成功结束率为 23.1%，开放式场景为 3.8%。陪伴或关系型对话本来就未必以完成任务为终点，因此应在相同目的下比较结束率。',
  'en':'For claude-opus-5.5, successful closure is 23.1% in task-oriented settings and 3.8% in open-ended settings. Companionship and relational exchanges need not end by completing a task, so closure rates should be compared within the same purpose.',
  'source':{'table':9,'page':23}},
 {'zh_title':'分数属于一段搭配，不完全属于模型本身。',
  'en_title':'A score belongs partly to the pairing.',
  'zh':'换成自我对话后，gpt-6-astra 的得分由标准用户条件下的 0.629 变为 0.677，claude-opus-5.5 则由 0.636 变为 0.599。对手方一变，两者的相对次序也会改变。',
  'en':'Under self-play, gpt-6-astra scores 0.677 rather than 0.629 against the standard user, while claude-opus-5.5 scores 0.599 rather than 0.636. Changing the partner reverses their relative ordering.',
  'source':{'table':13,'page':26}},
 {'zh_title':'架构带来的增益，最集中在主动适应。',
  'en_title':'Architecture gains concentrate at the active end.',
  'zh':'MetaMind、Cognizer、Claude Code 的平均增益都在主动阶段最大。Cognizer 的主动阶段增益为 +0.066，被动阶段为 +0.012；这提示需要看能力剖面，才能看清架构改善了哪里。',
  'en':'MetaMind, Cognizer, and Claude Code all show their largest mean stage gain in active adaptation. Cognizer gains +0.066 there versus +0.012 in passive execution. The capability profile shows where an architecture makes a difference.',
  'source':{'table':17,'page':28}},
]

evidence={'source':'Qwen_InteractEval.pdf','vocabulary':{'appendix':'A.3, Box 5','pdf_page':50,
 'families':[{'en':en,'zh':zh,'color':color,'slots':[{'en':e,'zh':z} for e,z in slots]} for en,zh,color,slots in families],
 'note':'Four participant-state families plus a separate interaction-level record. Sector width counts vocabulary fields, not observations.'},
 'findings':findings,'latent_episode':latent,'trajectories':{'source':{'table':36,'pdf_page':64,
 'scope':'Two illustrative episodes with the same scene and standard partner, not a controlled causal pair.'},'episodes':trajectories}}
(ROOT/'data'/'research-evidence.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def save(fig,name):
 for suffix in ['svg','png','pdf']:
  fig.savefig(OUT/f'{name}.{suffix}',dpi=190,bbox_inches='tight',facecolor=PAPER)
 plt.close(fig)

for lang in ['en','zh']:
 if lang=='zh': plt.rcParams['font.family']=['Microsoft YaHei','DejaVu Sans']
 else: plt.rcParams['font.family']='DejaVu Sans'
 zh=lang=='zh'
 fig,ax=plt.subplots(figsize=(12,11),subplot_kw={'aspect':'equal'},facecolor=PAPER)
 counts=[len(slots) for _,_,_,slots in families]
 ax.pie(counts,radius=.64,colors=[color for _,_,color,_ in families],startangle=98,counterclock=False,
        wedgeprops={'width':.40,'edgecolor':PAPER,'linewidth':1.5},
        labels=[z if zh else e.replace(' ','\n') for e,z,_,_ in families],
        labeldistance=.67,textprops={'fontsize':11,'color':'#213d2d','ha':'center'})
 slot_labels=[z if zh else e for _,_,_,slots in families for e,z in slots]
 slot_colors=[color for _,_,color,slots in families for _ in slots]
 ax.pie([1]*len(slot_labels),radius=1,colors=slot_colors,startangle=98,counterclock=False,
        wedgeprops={'width':.36,'edgecolor':PAPER,'linewidth':1},labels=slot_labels,
        labeldistance=1.07,rotatelabels=True,textprops={'fontsize':9.4})
 ax.text(0,0,'潜在状态\n词表' if zh else 'Latent-state\nvocabulary',ha='center',va='center',fontsize=12,color='#38533c')
 ax.set_title('对话表面之下，记录什么？' if zh else 'What is recorded beneath the dialogue?',fontsize=22,pad=30,loc='left',fontweight='medium')
 fig.text(.5,.015,'4 类参与者状态 + 独立的交互层记录；扇区表示词表字段，不表示样本频率。' if zh else '4 participant-state families + a separate interaction record. Sectors count vocabulary fields, not episodes.',ha='center',fontsize=9,color='#74816d')
 save(fig,f'latent-state-vocabulary-{lang}')

 fig=plt.figure(figsize=(14,8),facecolor=PAPER)
 gs=fig.add_gridspec(3,1,height_ratios=[2.3,.5,1.5],hspace=.35,left=.16,right=.95,top=.83,bottom=.13)
 ax=fig.add_subplot(gs[0]);path_ax=fig.add_subplot(gs[1],sharex=ax);interest_ax=fig.add_subplot(gs[2],sharex=ax)
 degree={'none':0,'low':1,'high':2,'very high':3}
 values=np.array([[degree[v] for v in row] for row in latent['slots'].values()])
 palette=['#eef1e8','#cddbbd','#7ca07c','#315f49']
 ax.imshow(values,aspect='auto',cmap=ListedColormap(palette),vmin=-.5,vmax=3.5,extent=[.5,10.5,4.5,-.5])
 state_names=['信任','情绪稳定','亲近','挫败','依赖'] if zh else list(latent['slots'])
 ax.set_yticks(range(5),state_names);ax.tick_params(axis='both',length=0,labelbottom=False)
 for row in range(5):
  for col in range(10):
   value=values[row,col];label=['无','低','高','很高'][value] if zh else ['None','Low','High','V. high'][value]
   ax.text(col+1,row,label,ha='center',va='center',fontsize=10,color='#f7f8f2' if value>=2 else '#38543b')
 for x in np.arange(.5,11,1):ax.axvline(x,color=PAPER,lw=2)
 for y in np.arange(-.5,5,1):ax.axhline(y,color=PAPER,lw=2)
 for spine in ax.spines.values():spine.set_visible(False)
 for i,p in enumerate(latent['path']):
  path_ax.barh(0,1,left=i+.5,color='#d9c6a0' if p=='Maintain' else '#9cbb9d',edgecolor=PAPER,height=.7)
  path_ax.text(i+1,0,('维持' if p=='Maintain' else '推进') if zh else p,ha='center',va='center',fontsize=9,color='#35523a')
 path_ax.set_yticks([0],['主导走向' if zh else 'Dominant path']);path_ax.tick_params(length=0,labelbottom=False)
 for spine in path_ax.spines.values():spine.set_visible(False)
 interest_ax.plot(latent['turns'],latent['interest'],color=GREEN,marker='o',lw=2)
 interest_ax.set_ylim(0,1);interest_ax.set_xlim(.5,10.5);interest_ax.set_xticks(range(1,11))
 interest_ax.set_yticks([0,.5,1]);interest_ax.grid(axis='y',color='#dce4d5',ls=':')
 interest_ax.set_xlabel('已评估对话轮次 →' if zh else 'Evaluated exchange →')
 interest_ax.set_ylabel('用户兴趣' if zh else 'User interest')
 for t in [1,5,7,10]: interest_ax.annotate(f"{latent['interest'][t-1]:.2f}",(t,latent['interest'][t-1]),xytext=(0,9),textcoords='offset points',ha='center',fontsize=9)
 fig.text(.16,.94,'话没说完，状态已经在变' if zh else 'The state changes before the story is fully told.',fontsize=22,color='#244633')
 fig.text(.16,.885,'一段对话的 10 轮记录 · 用户视角 · claude-fable-5.1 / claude-5-opus' if zh else 'One recorded conversation · user as subject · claude-fable-5.1 / claude-5-opus',fontsize=11,color='#70806a')
 fig.text(.16,.035,'状态格是有序类别，颜色表示程度、不表示好坏。用户兴趣另用 0–1 刻度；10 轮后成功结束。' if zh else 'States are ordinal; color indicates degree, not quality. Interest uses a separate 0–1 scale. Closure at turn 10.',fontsize=10,color='#74816d')
 save(fig,f'latent-state-over-time-{lang}')

 fig,axes=plt.subplots(3,1,figsize=(13,9),sharex=True,gridspec_kw={'height_ratios':[1,1,.8]},facecolor=PAPER)
 fig.subplots_adjust(left=.12,right=.95,top=.80,bottom=.17,hspace=.35)
 for ep,color in zip(trajectories,[SAND,GREEN]):
  for ax,field in zip(axes[:2],['interest','advance_probability']):
   ax.plot(ep['turns'],ep[field],marker='o',lw=2,color=color,label=ep['model'])
  row=0 if ep is trajectories[0] else 1
  for t,path in zip(ep['turns'],ep['path']):
   axes[2].barh(row,.83,left=t-.415,height=.56,color=color,alpha=.18)
   axes[2].text(t,row,('维持' if path=='Maintain' else '推进') if zh else path,ha='center',va='center',fontsize=10,color=color)
 for ax,label in zip(axes[:2],['用户兴趣' if zh else 'User interest','推进路径概率' if zh else 'P(Advance)']):
  ax.set_ylim(-.04,1.08);ax.set_yticks([0,.5,1]);ax.set_ylabel(label);ax.grid(axis='y',color='#dce4d5',ls=':')
 axes[0].legend(loc='upper left',bbox_to_anchor=(0,1.43),frameon=False,ncol=2,fontsize=11)
 axes[0].annotate('兴趣耗尽' if zh else 'Interest exhausted',(5,.20),xytext=(8,8),textcoords='offset points',color=SAND,fontsize=10)
 axes[0].annotate('成功结束' if zh else 'Successful closure',(6,.78),xytext=(-5,12),textcoords='offset points',ha='right',color=GREEN,fontsize=10)
 axes[2].set_yticks([0,1],['Fable','Opus']);axes[2].set_ylim(1.6,-.6);axes[2].set_xticks(range(1,7));axes[2].set_xlim(.5,6.5)
 axes[2].set_ylabel('主导走向' if zh else 'Dominant path');axes[2].set_xlabel('助手轮次 →' if zh else 'Assistant turn →')
 for spine in axes[2].spines.values():spine.set_visible(False)
 axes[2].tick_params(length=0)
 fig.text(.12,.945,'逐轮评分接近，交互走向却分开了' if zh else 'Similar early grades. Different courses of interaction.',fontsize=22,color='#244633')
 fig.text(.12,.902,'同一场景与标准用户；前两轮六级评分完全一致。两段观测记录，不作因果归因。' if zh else 'Same scene and standard user. Identical six-level grades for the first two turns. Two observed episodes, not a causal pair.',fontsize=10,color='#70806a')
 fig.text(.12,.06,'只连接相邻观测点；无平滑、无结束后补值。推进概率是当时的路径预测，不是已实现的结果。' if zh else 'Adjacent observations only: no smoothing or extension after stopping. P(Advance) is a forecast at that turn, not realized progress.',fontsize=10,color='#74816d')
 save(fig,f'trajectories-over-time-{lang}')

cards=''.join(f'<article><span>{i:02d}</span><div lang="zh-CN"><h2>{html.escape(f["zh_title"])}</h2><p>{html.escape(f["zh"])}</p></div><div lang="en"><h2>{html.escape(f["en_title"])}</h2><p>{html.escape(f["en"])}</p></div></article>' for i,f in enumerate(findings,1))
figures=''.join(f'<figure><h2>{title}</h2><img src="{name}-zh.png" alt="{title}"/><p><a href="{name}-en.png">English PNG</a> · <a href="{name}-zh.svg">中文 SVG</a> · <a href="{name}-en.svg">English SVG</a></p></figure>' for name,title in [('latent-state-vocabulary','潜在状态词表 / Latent-state vocabulary'),('latent-state-over-time','潜在状态时序 / Latent states over time'),('trajectories-over-time','交互轨迹时序 / Interaction trajectories over time')])
brief=f'''<!doctype html><html lang="zh-CN"><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>InteractEval · Findings / 主要发现</title><style>body{{background:#f7f8f2;color:#284735;font:16px/1.9 'Segoe UI','Microsoft YaHei',sans-serif;margin:0}}main{{max-width:1120px;margin:auto;padding:65px 30px}}header{{border-bottom:1px solid #ccd7c5;padding-bottom:40px}}header small{{letter-spacing:3px;color:#809574}}h1{{font-size:42px;line-height:1.25;font-weight:500}}header p{{max-width:760px;color:#6e8267}}article{{display:grid;grid-template-columns:35px 1fr 1fr;gap:30px;border-bottom:1px solid #d6e0ce;padding:35px 0}}article>span{{color:#a5b698}}h2{{font-size:23px;line-height:1.5;font-weight:500;margin:0 0 15px}}p{{margin:0;color:#667c5f}}figure{{margin:60px 0}}figure img{{max-width:100%;display:block}}a{{color:#4c7254}}footer{{margin-top:55px;font-size:12px;color:#86957c}}@media(max-width:700px){{article{{grid-template-columns:1fr;gap:18px}}h1{{font-size:32px}}main{{padding:35px 20px}}}}</style><main><header><small>INTERACTEVAL / RESEARCH BRIEF</small><h1>看见交互如何变化。<br/>See how an interaction changes.</h1><p>主要发现与时序图，中英文快速版。总体数值来自论文表格；时序图展示论文记录中的具体对话，不参与排行榜计算。</p></header>{cards}{figures}<footer>Measurement provenance: Tables 4, 8, 9, 13, 17; illustrative time-indexed records: Tables 36–37; vocabulary: Appendix A.3, Box 5. The figures reproduce reported observations, without smoothing or extension after stopping.</footer></main></html>'''
(OUT/'findings-bilingual.html').write_text(brief,encoding='utf-8')
with zipfile.ZipFile(OUT/'InteractEval-research-kit.zip','w',zipfile.ZIP_DEFLATED) as bundle:
 for file in sorted(OUT.iterdir()):
  if file.suffix in ['.svg','.png','.pdf','.html']:bundle.write(file,file.name)
 bundle.write(ROOT/'data'/'research-evidence.json','research-evidence.json')
with zipfile.ZipFile(OUT/'InteractEval-figures-en.zip','w',zipfile.ZIP_DEFLATED) as bundle:
 for file in sorted(OUT.iterdir()):
  if file.stem.endswith('-en') and file.suffix in ['.svg','.png','.pdf']:bundle.write(file,file.name)
print('Rendered bilingual SVG, PNG, PDF figures and research brief to',OUT)
