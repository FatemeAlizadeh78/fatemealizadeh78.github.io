#!/usr/bin/env python3
"""Check static HTML links, anchors, asset references and publishing boundaries."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json

ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.links=[];self.ids=set();self.title=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f'Duplicate id {a["id"]}'
            self.ids.add(a['id'])
        if tag=='title':self.title=True
        for key in ('href','src'):
            if key in a:self.links.append(a[key])
        if tag=='img':assert a.get('alt'), 'Image needs alt text'

def check():
    pages={}
    for path in [ROOT/'index.html',*sorted((ROOT/'research').glob('*.html'))]:
        parser=Page();parser.feed(path.read_text());assert parser.title,path;pages[path.resolve()]=parser
    assert len(pages)==4,'Expected landing page and three case studies'
    for path,parser in pages.items():
        for link in parser.links:
            u=urlsplit(link)
            if u.scheme or u.netloc:continue
            target=(path.parent/unquote(u.path)).resolve() if u.path else path
            if target.is_dir():target=target/'index.html'
            assert target.exists(),f'{path.name}: missing {link}'
            if u.fragment and target in pages:assert u.fragment in pages[target].ids,f'Missing anchor {link}'
    data=json.loads((ROOT/'data/projects.json').read_text());assert len(data)==3
    for item in data:assert len(item['columns'])==len(item['rows'][0])
    alltext='\n'.join(p.read_text() for p in pages)
    assert 'sources/cv/' not in alltext and 'sources/project-review/' not in alltext
    assert '+49 176' not in alltext
    print('PASS: four pages, local links, anchors, assets, tables, and publishing boundaries')

if __name__=='__main__':check()
