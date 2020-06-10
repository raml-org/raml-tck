import traceback
import os

from . import parsers
from . import utils


PARSERS = {
    'ramlfications': parsers.ramlfications_parser,
    'pyraml-parser': parsers.pyraml_parser,
}

# Parsers meta-data which helps generating pretty reports.
# Required fields are: url, version.
# Name and language are used in links creation.
PARSERS_META = {
    'ramlfications': {
        'url': 'https://github.com/spotify/ramlfications',
        'version': '0.1.9',
    },
    'pyraml-parser': {
        'url': 'https://github.com/an2deg/pyraml-parser',
        'version': '0.1.9',
    },
}


def main():
    args = utils.parse_args()
    parser_func = PARSERS[args.parser]

    ex_dir = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '..', # raml-tck/runner/py
        '..', # raml-tck/runner
        '..' # raml-tck/
    )

    file_list = utils.list_ramls(ex_dir)
    parser_meta = PARSERS_META[args.parser].copy()
    parser_meta.update({
        'language': 'py',
        'name': args.parser,
    })
    report = {
        'parser': parser_meta,
        'results': [],
    }

    for fpath in file_list:
        success = True
        err = None
        try:
            parser_func(fpath)
        except Exception:
            success = False
            err = traceback.format_exc()

        result = {
            'file': fpath.replace(ex_dir, ''),
            'success': success
        }

        if err:
            result['error'] = err
        report['results'].append(result)

    utils.save_report(report, args.outdir)
