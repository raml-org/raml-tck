import argparse
import tempfile
import shutil
import os
import json


# Parser command line arguments
def parse_args():
    arg_parser = argparse.ArgumentParser(
        description='Test few RAML Python parsers.')
    arg_parser.add_argument(
        '--parser', type=str, help='Parser to test',
        choices=[
            'ramlfications',
            'pyraml-parser',
        ],
        required=True)
    arg_parser.add_argument(
        '--outdir', type=str, help='Output directory',
        default='./',
        required=False)
    return arg_parser.parse_args()


# Lists RAML files in a folder
def list_ramls(ex_dir):
    manifest_path = os.path.join(ex_dir, 'manifest.json')
    with open(manifest_path) as f:
        manifest = json.load(f)
    return [os.path.join(ex_dir, fp) for fp in manifest['filePaths']]


# Saves report to json file in output folder
def save_report(report, outdir):
    outdir = os.path.abspath(outdir)
    if not os.path.exists(outdir):
        os.makedirs(outdir)
    report_fpath = os.path.join(
        outdir, '{}_{}.json'.format(
            report['parser']['name'],
            report['parser']['language']))
    with open(report_fpath, 'w') as f:
        json.dump(report, f, indent=2)
