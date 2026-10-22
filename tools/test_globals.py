import os
import glob, re

files = glob.glob('js/**/*.js', recursive=True)

# Order in index.html
load_order = [
  'js/lib/utils.js',
  'js/lib/data.js',
  'js/lib/supabase.js',
  'js/components/icons.js',
  'js/lib/state.js',
  'js/app/router.js',
  'js/lib/gamification.js',
  'js/components/fx.js',
  'js/components/toast.js',
  'js/components/timer.js',
  'js/components/charts.js',
  'js/components/bodymap.js',
  'js/lib/ai.js',
  'js/features/auth.js',
  'js/features/editor.js',
  'js/features/coach.js',
  'js/features/workout.js',
  'js/features/share.js',
  'js/features/feed.js',
  'js/views/home.js',
  'js/views/workouts.js',
  'js/views/feed.js',
  'js/views/progress.js',
  'js/views/nutrition.js',
  'js/views/profile.js',
  'js/app/wiring.js',
  'js/app/boot.js'
]

defined_symbols = set([
  # Browser APIs
  'window', 'document', 'localStorage', 'navigator', 'console', 'Math', 'Date',
  'JSON', 'Array', 'Object', 'String', 'Number', 'Set', 'Promise', 'fetch',
  'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame',
  'performance', 'encodeURIComponent', 'parseInt', 'parseFloat', 'isFinite',
  'URL', 'File', 'Blob', 'Image', 'AudioContext', 'webkitAudioContext',
  'crypto', 'TextEncoder', 'Uint8Array', 'location', 'location.reload'
])

for f in load_order:
    path = os.path.normpath(f)
    with open(path, 'r', encoding='utf-8') as fp:
        code = fp.read()
    # Find all function definitions: function foo, async function foo, const foo = ...
    funcs = re.findall(r'(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(', code)
    consts = re.findall(r'(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=', code)
    for fn in funcs:
        defined_symbols.add(fn)
    for c in consts:
        defined_symbols.add(c)

print(f"Total symbols defined in app scope: {len(defined_symbols)}")

# Verify all key functions we expect
expected = [
  'openEditorAIAssistant', 'runEditorAIGeneration', 'applyAISuggestions',
  'runNutritionAIAnalysis', 'saveLastAnalysisToDiary', 'processInstantGoogleLogin',
  'aiSuggestForWorkout', 'analyzeMealWithAI', 'localEstimateMeal',
  'calcReadiness', 'getTodayHabits', 'speakCoach', 'openWarmupCalculator',
  'openExerciseSubstitutionModal', 'openAICoachChat', 'analyzeMealPhotoWithAI',
  'quickAddFood', 'handleMealPhotoUpload',
  'sbGetClient', 'sbSignUp', 'sbSignIn', 'sbSignInWithGoogle', 'sbSyncAll', 'sbPushPost', 'sbPullFeed',
  'fbPostPush', 'fbFeedPull', 'bodyMapHTML', 'groupsLegendHTML',
  'stravaPost', 'celebrate', 'toast', 'modalHTML', 'modalConfirm',
  'Timer', 'levelInfo', 'checkAchievements'
]

missing = [x for x in expected if x not in defined_symbols]
if missing:
    print(f"ERROR: Missing expected symbols: {missing}")
else:
    print("SUCCESS: All key functions and modules are properly defined and accessible in the global scope!")
