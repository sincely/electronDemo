@echo off

rem 执行命令目录localPath %1% 

rem 命令command %2%

cd %1%

echo "Command Start..." > log.txt

echo %1% >> log.txt
echo %2% >> log.txt

yarn %2%  >> log.txt

echo "Command End..." >> log.txt

pause

exit
