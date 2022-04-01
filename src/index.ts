import { DefaultRubyVM } from "./browser";

let rubyVm:any = null;
const main = async () => {
  // Fetch and instntiate WebAssembly binary
  const response = await fetch(
    "https://cdn.jsdelivr.net/npm/ruby-head-wasm-wasi@0.2.0/dist/ruby.wasm"
  );
  const buffer = await response.arrayBuffer();
  const module = await WebAssembly.compile(buffer);
  const { vm } = await DefaultRubyVM(module);
  rubyVm = vm;

  rubyVm.printVersion();

  document.getElementById("run").onclick = runRubyScriptsInHtml;
  document.getElementById("clear").onclick = selectAllScripts;
  document.getElementById("files").onclick = listFiles;

  runRubyScriptsInHtml();
};

export const runRubyScriptsInHtml = function () {
  const input = <HTMLTextAreaElement>document.getElementById("input");
  const output = <HTMLTextAreaElement>document.getElementById("output");
  const result = rubyVm.eval(input.value);
  output.value = result;

  listFiles();
};

export const selectAllScripts = function () {
  const input = <HTMLTextAreaElement>document.getElementById("input");
  input.focus();
  input.select();
};

const listFiles = function () {
  const files = <HTMLTextAreaElement>document.getElementById("files");

  const script = `def filetree(path)
  str = "#{path}\n"
  Dir.entries(".").each do |file|
    if File.directory?(file)
      str += "├─ #{file}/\n"
    else
      str += "├─ #{file}\n"
    end     
  end
  str
end

filetree("/")
  `; 

  files.value = rubyVm.eval(script);
};

main();
