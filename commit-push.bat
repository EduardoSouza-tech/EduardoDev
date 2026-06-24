@echo off
cd /d "%~dp0"

echo ============================================
echo  Commit e Push - Portfólio Eduardo Souza
echo ============================================
echo.

:: Verifica se já tem git iniciado
if not exist ".git" (
    echo Inicializando repositório git...
    git init
    git branch -m main
    git remote add origin https://github.com/EduardoSouza-tech/EduardoDev.git
) else (
    echo Repositório git já existe.
    git remote set-url origin https://github.com/EduardoSouza-tech/EduardoDev.git
)

echo.
echo Adicionando arquivos...
git add index.html assets/css/style.css assets/js/main.js

echo.
echo Criando commit...
git commit -m "redesign: dark theme com navbar horizontal, cards cyan e nova secao contato"

echo.
echo Fazendo push para GitHub...
git push -u origin main

echo.
echo ============================================
if %ERRORLEVEL% == 0 (
    echo  Sucesso! Alteracoes enviadas ao GitHub.
) else (
    echo  Erro no push. Verifique suas credenciais.
    echo  Tente: git push -u origin main
)
echo ============================================
echo.
pause
