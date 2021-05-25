@echo off

rem 项目存放路径 %1% 

rem 项目git地址 %2% 

rem 项目文件夹名称 %3%

cd %1%

echo "Command Start..." > log.txt

git clone %2%  >> log.txt

:loop

if not exist %3% goto loop

cd %3% >> ../log.txt

if exist package.json (
    echo "exist package.json" >> ../log.txt
    goto install
)

echo

:install
yarn >> ../log.txt

echo "Command End..." >> ../log.txt

pause

exit
