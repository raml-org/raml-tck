import ramlfications
import pyraml.parser


# https://github.com/spotify/ramlfications
def ramlfications_parser(fpath):
    return ramlfications.parse(fpath)


# https://github.com/an2deg/pyraml-parser
def pyraml_parser(fpath):
    return pyraml.parser.load(fpath)
