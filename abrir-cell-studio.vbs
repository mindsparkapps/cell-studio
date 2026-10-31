' Inicia el servidor local de Cell Studio (oculto) y abre la app en el navegador.
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
sh.Run "cmd /c node serve.mjs", 0, False
WScript.Sleep 1200
sh.Run "http://127.0.0.1:4173/"
