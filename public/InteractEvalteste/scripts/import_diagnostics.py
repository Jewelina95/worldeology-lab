"""Read supplementary published tables without deriving rankings from examples."""
import re


def enrich_publication(paper, pdf):
    text = '\n'.join(page.get_text() for page in pdf).replace('\u2212', '-')
    names = [model['name'] for model in paper['models']]
    pattern = re.compile(r'(?m)^(' + '|'.join(map(re.escape, names)) + r')[\u2020\u22c4]?\s*$')

    def table_rows(table, count, integer=False):
        block = text.split(f'Table {table}:', 1)[1].split(f'Table {table + 1}:', 1)[0]
        if table == 22:
            block = block.split('Scored system', 1)[1]
        matches = list(pattern.finditer(block))[:10]
        if len(matches) != 10 or {match.group(1) for match in matches} != set(names):
            raise ValueError(f'Unexpected roster in Table {table}')
        result = {}
        for index, match in enumerate(matches):
            segment = block[match.end():matches[index + 1].start() if index < 9 else len(block)]
            numbers = re.findall(r'[-+]?\d+(?:\.\d+)?' if integer else r'[-+]?\d+\.\d+', segment)
            if len(numbers) < count:
                raise ValueError(f'Missing values in Table {table}: {match.group(1)}')
            result[match.group(1)] = list(map(float, numbers[:count]))
        return result

    behavior = table_rows(8, 4)
    partner = table_rows(12, 5)
    self_play = table_rows(13, 4)
    user = table_rows(14, 10)
    reliability = table_rows(21, 5)
    judges = table_rows(22, 4)
    duration = table_rows(30, 10, integer=True)
    matrix = table_rows(11, 12)
    for model in paper['models']:
        name = model['name']
        model['behavior'] = dict(zip(['fabrication', 'clarification'], behavior[name][2:]))
        model['partner'] = dict(zip(['probing', 'cooperativeness', 'uptake_pressure', 'active_pressure', 'pressure_difference'], partner[name]))
        model['self_play'] = dict(zip(['similarity', 'score', 'standard_user', 'gap'], self_play[name]))
        values = user[name]
        model['user_role'] = {'composite': values[0], 'levels': values[1:7], 'stages': values[7:10]}
        values = reliability[name]
        model['reliability'] = {'passes': values[:3], 'mean': values[3], 'sd': values[4], 'judges': judges[name]}
        values = duration[name]
        if abs(values[5] - model['composite']) > .0001:
            raise ValueError(f'Table 30 full-design mismatch: {name}')
        model['duration'] = {'median': int(values[0]), 'q1': int(values[1]), 'q3': int(values[2]), 'adaptive': values[6], 'fixed': values[7:10]}
    paper['interaction_matrix'] = [{'partner': name, 'scores': matrix[name][:10], 'mean': matrix[name][10], 'span': matrix[name][11]} for name in names]
    for key, table in [('behavior', 8), ('partners', 12), ('self_play', 13), ('user_role', 14), ('reliability', 21), ('judges', 22), ('duration', 30), ('pairings', 11)]:
        page = next(i + 1 for i, p in enumerate(pdf) if f'Table {table}:' in p.get_text())
        paper['tables'][key] = {'table': table, 'page': page}
    from import_comparisons import enrich_comparisons
    return enrich_comparisons(paper, pdf)
