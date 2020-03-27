require 'optparse'
require 'ostruct'
require 'tmpdir'
require 'fileutils'
require 'json'

# OptParse parses CLI options
class OptParse
  # brujula: https://github.com/nogates/brujula
  # ramlrb:  https://github.com/jpb/raml-rb
  @parsers = %w[brujula raml-rb]

  class << self
    attr_accessor :parsers
  end

  def self.parse(args)
    options = OpenStruct.new
    options.verbose = false
    options.parser = ''
    options.outdir = './'
    options.branch = ''

    opt_parser = OptionParser.new do |opts|
      opts.banner = 'Usage: ruby main.rb [options]'

      opts.separator ''
      opts.separator 'Specific options:'

      opts.on('--verbose', 'Print errors traces') do |v|
        options.verbose = v
      end

      opts.on('--parser NAME', parsers, 'Parser to test') do |parser|
        options.parser = parser
      end

      opts.on('--outdir PATH', 'Output directory') do |outdir|
        options.outdir = outdir
      end

      opts.on('--branch PATH', 'raml-tck branch with RAML files') do |branch|
        options.branch = branch
      end

      opts.separator ''
      opts.separator 'Common options:'

      opts.on_tail('-h', '--help', 'Show this message') do
        puts opts
        exit
      end
    end

    opt_parser.parse!(args)
    options
  end
end

# Lists RAML files in a folder
def list_ramls(ex_dir)
  manifest_path = File.join(ex_dir, 'manifest.json')
  manifest_file = File.read(manifest_path)
  manifest = JSON.parse(manifest_file)
  manifest['filePaths'].map do |fpath|
    File.join(ex_dir, fpath)
  end
end

# Saves report to JSON file
def save_report(report, outdir)
  outdir = File.expand_path(outdir)
  FileUtils.mkdir_p(outdir) unless File.directory?(outdir)
  report_file = File.join(
    outdir,
    "#{report['parser']['name']}_#{report['parser']['language']}.json")
  File.open(report_file, 'w') do |f|
    f.write(JSON.pretty_generate(report))
  end
end
