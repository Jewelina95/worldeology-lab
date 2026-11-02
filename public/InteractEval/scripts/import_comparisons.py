"""Import matched-information and group-size comparisons from the publication."""
from pathlib import Path
import json
import re


def enrich_comparisons(paper, pdf):
    text = '\n'.join(page.get_text() for page in pdf).replace('\u2212', '-')
    names = [model['name'] for model in paper['models']]
    block = text.split('Table 18:', 1)[1].split('4.7 Human review', 1)[0].split('System\n', 1)[1]
    pattern = re.compile('|'.join(map(re.escape, names)))
    matches = list(pattern.finditer(block))
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(block)
        values = [float(v) for v in re.findall(r'[-+]?\d+\.\d+', block[match.end():end])[:9]]
        if len(values) != 9:
            raise ValueError('Incomplete group-size row: ' + match.group())
        model = next(model for model in paper['models'] if model['name'] == match.group())
        model['group_size'] = dict(zip(['passive_responsive', 'active', 'coherence'], [values[:3], values[3:6], values[6:9]]))
    if len(matches) != len(names):
        raise ValueError('Incomplete Table 18 roster')

    block = text.split('Table 7:', 1)[1].split('Scenario facets have distinct effects', 1)[0]
    upper, lower = block.split('within-scenario variance', 1)
    matched_names = ['gpt-6-astra', 'gpt-5.6-sol', 'gemini-3.8-flash']
    def matched_rows(panel):
        matches = list(pattern.finditer(panel))
        result = {}
        for index, match in enumerate(matches):
            end = matches[index + 1].start() if index + 1 < len(matches) else len(panel)
            result[match.group()] = [float(v) for v in re.findall(r'\d+\.\d+', panel[match.end():end])[:3]]
        if set(result) != set(matched_names) or any(len(row) != 3 for row in result.values()):
            raise ValueError('Incomplete Table 7 comparison')
        return result
    conditions, variants = matched_rows(upper), matched_rows(lower)
    paper['matched_information'] = [{'name': name, 'conditions': conditions[name], 'variants': variants[name]} for name in matched_names]
    for key, table in [('matched_information', 7), ('group_size', 18)]:
        page = next(i + 1 for i, page in enumerate(pdf) if f'Table {table}:' in page.get_text())
        paper['tables'][key] = {'table': table, 'page': page}
    return paper


if __name__ == '__main__':
    import fitz
    root = Path(__file__).resolve().parent.parent
    path = root / 'data/paper-results.json'
    paper = json.loads(path.read_text(encoding='utf-8'))
    enrich_comparisons(paper, fitz.open(root / 'assets/Qwen_InteractEval.pdf'))
    path.write_text(json.dumps(paper, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Imported Table 7 matched scenarios and Table 18 group-size comparisons.')
