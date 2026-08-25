# Before / after gallery images

Drop 12 images in this folder using the exact filenames below, then follow
"Switching them on" at the bottom. Nothing else needs editing.

| Job | Before | After |
|---|---|---|
| Rear bumper scrape | `bumper-before.jpg` | `bumper-after.jpg` |
| Front guard respray | `guard-before.jpg` | `guard-after.jpg` |
| Key scratch down the doors | `scratch-before.jpg` | `scratch-after.jpg` |
| Swirled / dull paint | `polish-before.jpg` | `polish-after.jpg` |
| Trolley dent in a door | `dent-before.jpg` | `dent-after.jpg` |
| Corner park collision | `collision-before.jpg` | `collision-after.jpg` |

## Specs

- **1600 × 1000px** (8:5). The slider crops to this ratio, so anything else gets trimmed.
- JPG, quality ~85. Aim under 400KB each.
- **Both halves of a pair must line up**: same car, same angle, same distance, same
  lighting, same background. That alignment is the whole trick — if the camera moves
  between the two shots the slider looks broken rather than impressive.

## The best source: your own jobs

Two photos per job, taken from a tripod or a marked spot on the ground:

1. Before you start, shoot the damage.
2. When you finish, stand in the **same place** and shoot again.

Same phone, same distance, avoid direct sun (overcast or shade is ideal). This beats
any stock or generated image, and it is the only version that is honestly yours.

## If you want AI-generated placeholders instead

Generate the **clean** car first, then ask the tool to *edit that same image* to add the
damage. Generating two separate images gives you two different cars and the pair falls
apart. Every current tool (ChatGPT, Firefly, Midjourney, Gemini) supports this edit step.

**Step 1 - the "after" shot.** Example for the door scratch pair:

> Photorealistic photograph of the driver's side rear door of a silver metallic sedan,
> shot square-on from about two metres away, filling the frame. Freshly detailed, glossy,
> flawless paint. Soft overcast daylight, suburban driveway blurred in the background.
> Shot on a 50mm lens, shallow depth of field, no text, no watermark, 16:10.

Save it as `scratch-after.jpg`.

**Step 2 - the "before" shot.** Upload the image from step 1 and ask for an edit:

> Using this exact image, keep the car, camera angle, lighting and background identical.
> Add a deep key scratch running horizontally across the door, roughly 40cm long, cutting
> through the clear coat to the grey primer underneath, with a few finer parallel
> scratches around it and small paint chips along its length. Change nothing else.

Save that as `scratch-before.jpg`.

Repeat for the other five, swapping the damage description:

- **bumper** - "cracked and heavily scuffed rear bumper corner, deep scrapes through the paint, plastic showing"
- **guard** - "sun-damaged front guard with peeling, flaking clear coat and chalky faded paint"
- **polish** - "dull oxidised black paint covered in fine circular swirl marks and wash scratches"
- **dent** - "a shallow round dent about the size of a fist in the middle of the door, paint unbroken"
- **collision** - "crumpled front corner panel with a dented, misaligned bumper and cracked paint"

## Switching them on

Open `src/lib/images.ts`, find the `galleryPhotos` block, and swap the remote URLs for
local paths:

```ts
export const galleryPhotos = {
  bumperBefore: "/gallery/bumper-before.jpg",
  bumperAfter: "/gallery/bumper-after.jpg",
  guardBefore: "/gallery/guard-before.jpg",
  guardAfter: "/gallery/guard-after.jpg",
  scratchBefore: "/gallery/scratch-before.jpg",
  scratchAfter: "/gallery/scratch-after.jpg",
  polishBefore: "/gallery/polish-before.jpg",
  polishAfter: "/gallery/polish-after.jpg",
  dentBefore: "/gallery/dent-before.jpg",
  dentAfter: "/gallery/dent-after.jpg",
  collisionBefore: "/gallery/collision-before.jpg",
  collisionAfter: "/gallery/collision-after.jpg",
} as const;
```

Titles, suburbs and descriptions for each pair live in the `gallery` array in
`src/lib/site.ts` - update those to match the real jobs at the same time.
