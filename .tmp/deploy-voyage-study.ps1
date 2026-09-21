$ErrorActionPreference='Stop'
$voyagePaths=@('learning/inquiry/age-of-exploration/NATURE-DISCOVERIES-REVIEW.md',
'learning/inquiry/age-of-exploration/PLACE-STUDY-REVIEW.md',
'learning/inquiry/age-of-exploration/data/catalog/city-landmarks.json',
'learning/inquiry/age-of-exploration/data/catalog/discoveries.json',
'learning/inquiry/age-of-exploration/data/catalog/photo-credits.json',
'learning/inquiry/age-of-exploration/lib/classroom-store.js',
'learning/inquiry/age-of-exploration/lib/place-study.js',
'learning/inquiry/age-of-exploration/package.json',
'learning/inquiry/age-of-exploration/public/index.html',
'learning/inquiry/age-of-exploration/public/teacher.html',
'learning/inquiry/age-of-exploration/server.js',
'learning/inquiry/age-of-exploration/public/css/place-study.css',
'learning/inquiry/age-of-exploration/public/js/place-study-ui.js',
'learning/inquiry/age-of-exploration/public/assets/landmarks/batur-caldera.webp',
'learning/inquiry/age-of-exploration/public/assets/landmarks/chocolate-hills.webp',
'learning/inquiry/age-of-exploration/public/assets/landmarks/milford-sound.webp',
'learning/inquiry/age-of-exploration/public/assets/landmarks/palawan-underground-river.webp',
'learning/inquiry/age-of-exploration/tests/nature-discoveries-smoke.js',
'learning/inquiry/age-of-exploration/tests/place-study-unit.js',
'learning/inquiry/age-of-exploration/tests/place-study-smoke.js',
'learning/inquiry/age-of-exploration/tests/v70-final-quiz-unit.js')
$voyagePreviousIndex=$env:GIT_INDEX_FILE
try {
 $env:GIT_INDEX_FILE=Join-Path (Get-Location) '.tmp/voyage-study-deploy-20260921.index'
 git fetch origin main
 if($LASTEXITCODE -ne 0){throw 'fetch failed'}
 $voyageBase=(git rev-parse origin/main).Trim()
 $voyageRemoteChanges=git diff --name-only HEAD $voyageBase -- $voyagePaths
 if($voyageRemoteChanges){throw ('Remote voyage files changed: '+($voyageRemoteChanges -join ', '))}
 git read-tree $voyageBase
 if($LASTEXITCODE -ne 0){throw 'read-tree failed'}
 git add -- $voyagePaths
 if($LASTEXITCODE -ne 0){throw 'add failed'}
 git diff --cached --check $voyageBase
 if($LASTEXITCODE -ne 0){throw 'diff check failed'}
 git diff --cached --stat $voyageBase
 $voyageTree=(git write-tree).Trim()
 if($LASTEXITCODE -ne 0){throw 'write-tree failed'}
 $voyageCommit=(git commit-tree $voyageTree -p $voyageBase -m 'feat(voyage): add place study missions and real landscape photos').Trim()
 if($LASTEXITCODE -ne 0){throw 'commit failed'}
 Set-Content -LiteralPath '.tmp/voyage-study-deploy-commit.txt' -Value $voyageCommit -NoNewline
 git push origin "${voyageCommit}:refs/heads/main"
 if($LASTEXITCODE -ne 0){throw 'push failed'}
 Write-Output ('DEPLOY_COMMIT='+$voyageCommit)
} finally {
 if($null -eq $voyagePreviousIndex){Remove-Item Env:GIT_INDEX_FILE -ErrorAction SilentlyContinue}else{$env:GIT_INDEX_FILE=$voyagePreviousIndex}
}

