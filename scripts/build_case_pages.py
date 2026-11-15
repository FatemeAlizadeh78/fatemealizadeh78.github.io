#!/usr/bin/env python3
"""Generate static case studies from curated, source-backed project records."""
from pathlib import Path
from html import escape as e
import json

ROOT = Path(__file__).resolve().parents[1]

def build():
    projects=json.loads((ROOT/'data/projects.json').read_text())
    out=ROOT/'research';out.mkdir(exist_ok=True)
    for p in projects:
        link='https://github.com/FatemeAlizadeh78/'+p['repository']
        methods=''.join('<li>'+e(x)+'</li>' for x in p['methods'])
        limits=''.join('<li>'+e(x)+'</li>' for x in p['limits'])
        head=''.join('<th scope="col">'+e(x)+'</th>' for x in p['columns'])
        rows=''.join('<tr>'+''.join('<td>'+e(x)+'</td>' for x in row)+'</tr>' for row in p['rows'])
        image=''
        if p.get('image'):
            image=f'<figure><img class="case-image" src="../assets/{e(p["image"])}" alt="{e(p["image_caption"])}" loading="lazy"><figcaption class="case-caption">{e(p["image_caption"])}</figcaption></figure>'
        page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(p['title'])} | Fatemeh Alizadeh</title><meta name="description" content="{e(p['intro'])}"><link rel="canonical" href="https://fatemealizadeh78.github.io/research/{e(p['slug'])}.html"><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../styles.css"></head><body><a class="skip" href="#main">Skip to content</a><header class="site-header wrap"><a class="wordmark" href="../"><span class="monogram">fa<span>.</span></span><span>Fatemeh Alizadeh<small>Research portfolio</small></span></a><nav aria-label="Case study navigation"><a href="../#research">All research</a><a href="{link}">Repository ↗</a></nav></header><main id="main" class="case-main wrap"><a class="back-link" href="../#research">← Back to selected research</a><h1>{e(p['title'])}</h1><p class="standfirst">{e(p['intro'])}</p><div class="case-meta"><span>{e(p['category'])}</span><span>2026</span><a class="text-link" href="{link}">Explore the source code ↗</a></div><section><h2>The question</h2><p>{e(p['question'])}</p></section><section><h2>Experimental design</h2><ul>{methods}</ul></section><section><h2>Results and their interpretation</h2><div class="table-wrap"><table><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table></div><p class="case-note">{e(p['result_note'])}</p>{image}</section><section><h2>What the experiment does not establish</h2><ul>{limits}</ul></section><section><h2>Reproduce and inspect</h2><p>{e(p['reproduce'])}</p><a class="button" href="{link}">Open the repository ↗</a><p class="case-caption">Evidence: {e(p['source_note'])}</p></section></main><footer class="site-footer wrap"><span>Fatemeh Alizadeh</span><a href="../#contact">Get in touch ↗</a></footer></body></html>'''
        (out/(p['slug']+'.html')).write_text(page+'\n')
    print(f'Generated {len(projects)} case studies.')

if __name__=='__main__':build()
