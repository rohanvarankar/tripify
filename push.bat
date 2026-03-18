@echo off
echo Starting Git Push Process...
git config --global user.email "test@example.com"
git config --global user.name "Tripify Admin"
git init
git add .
git commit -m "🚀 Initial commit for Tripify Full Stack Application"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/rohanvarankar/tripify.git
echo Pushing to GitHub...
git push -u origin main
echo Done!
