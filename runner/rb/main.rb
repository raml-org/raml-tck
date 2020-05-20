require_relative './utils'
require_relative './parsers'

def parse_with(parser_name, fpath)
  case parser_name
  when 'brujula'
    brujula_parse(fpath)
  when 'raml-rb'
    ramlrb_parse(fpath)
  end
end

def main
  # Parsers meta-data which helps generating pretty reports.
  # Required fields are: name, language, url, version.
  # Name and language are used in links creation.
  parsers_meta = {
    'brujula' => {
      'name' => 'brujula',
      'language' => 'rb',
      'url' => 'https://github.com/nogates/brujula',
      'version' => '0.2.0'
    },
    'raml-rb' => {
      'name' => 'raml-rb',
      'language' => 'rb',
      'url' => 'https://github.com/jpb/raml-rb',
      'version' => '1.2.1'
    }
  }

  options = OptParse.parse(ARGV)
  ex_dir = File.expand_path(File.join('..', '..'))
  files_list = list_ramls(ex_dir)

  report = {
    'parser' => parsers_meta[options.parser],
    'results' => []
   }

  error = nil

  files_list.each do |fpath|
    success = true

    begin
      parse_with(options.parser, fpath)
    rescue StandardError => e
      success = false
      error = "#{e.message}\n#{e.backtrace.join("\n")}"
    end

    relative_fpath = fpath.sub! ex_dir, ''
    result = {
      'file' => relative_fpath,
      'success' => success
    }
    unless error == nil
      result['error'] = error
    end
    report['results'] << result
  end

  save_report(report, options.outdir)
end

main
