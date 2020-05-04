require 'brujula'
require 'raml/parser'

# https://github.com/nogates/brujula
def brujula_parse(fpath)
  # Access 'root' because looks like brujula uses lazy loading
  Brujula.parse_file(fpath).root
end

# https://github.com/jpb/raml-rb
def ramlrb_parse(fpath)
  Raml::Parser.parse_file(fpath)
end
