# Synapse Design System

## 1. Design direction

Synapse is a calm academic workspace with a soft, spacious visual language.

Characteristics:
- generous whitespace
- large rounded surfaces
- restrained neutral palette
- blue as the primary action/accent
- very light cyan/ivory support surfaces
- near-black typography
- subtle 10% borders
- full-rounded controls
- occasional expressive gradients for content categories
- motion used to clarify state, not decorate the interface

The visual language should feel like a learning workspace rather than a marketing website.

## 2. Color source values

Provided design values:

```text
Brand blue       #3072FF
Brand blue light #6898FF
Alert            #FF2727

Ivory            #E8F4F7
Cherry white     #F9F9FC

Black            #0E0E0E
Ink black        #171717
Light black      #1F1F1F

Light icons      #B0A8B8
Dark icons       #6D6D6D

Light border     rgba(14,14,14,0.10)
Dark border      rgba(255,255,255,0.10)
```

## 3. Semantic tokens

Do not use raw hex values throughout components.

Map the visual language to semantic tokens:

```text
background
foreground

card
card-foreground

popover
popover-foreground

primary
primary-foreground

secondary
secondary-foreground

muted
muted-foreground

accent
accent-foreground

destructive
destructive-foreground

border
input
ring

sidebar
sidebar-foreground
sidebar-primary
sidebar-primary-foreground
sidebar-accent
sidebar-accent-foreground
sidebar-border
sidebar-ring
```

Add only genuinely necessary custom semantic tokens:

```text
brand
brand-foreground
surface-soft
surface-soft-foreground
icon
success
warning
chart-1..5
```

Do not create tokens such as `os-blue`, `course-yellow`, `memory-purple` unless the value has a stable semantic meaning.

## 4. Light theme mapping

Recommended starting mapping:

```text
background             #F9F9FC
foreground             #171717

card                   #FFFFFF
card-foreground        #171717

popover                #FFFFFF
popover-foreground     #171717

primary                #3072FF
primary-foreground     #FFFFFF

secondary              #E8F4F7
secondary-foreground   #171717

muted                  #E8F4F7
muted-foreground       #6F6F78

accent                  #E8F4F7
accent-foreground       #171717

destructive             #FF2727
destructive-foreground  #FFFFFF

border                  rgba(14,14,14,0.10)
input                   rgba(14,14,14,0.10)
ring                    #3072FF

sidebar                 #F9F9FC
sidebar-foreground      #171717
sidebar-primary         #3072FF
sidebar-primary-foreground #FFFFFF
sidebar-accent          #E8F4F7
sidebar-accent-foreground #171717
sidebar-border          rgba(14,14,14,0.10)
sidebar-ring            #3072FF
```

## 5. Dark theme mapping

Start from the demonstrated dark direction:

```text
background             #0E0E0E
foreground             #F9F9FC

card                   #171717
card-foreground        #F9F9FC

popover                #1F1F1F
popover-foreground     #F9F9FC

primary                #3072FF
primary-foreground     #FFFFFF

secondary              #1F1F1F
secondary-foreground   #F9F9FC

muted                  #1F1F1F
muted-foreground       #A3A3A3

accent                  #1F1F1F
accent-foreground       #F9F9FC

destructive             #FF2727
destructive-foreground  #FFFFFF

border                  rgba(255,255,255,0.10)
input                   rgba(255,255,255,0.10)
ring                    #6898FF

sidebar                 #0E0E0E
sidebar-foreground      #F9F9FC
sidebar-primary         #3072FF
sidebar-primary-foreground #FFFFFF
sidebar-accent          #171717
sidebar-accent-foreground #F9F9FC
sidebar-border          rgba(255,255,255,0.10)
sidebar-ring             #6898FF
```

These are implementation starting points, not claims that every screen is final.

## 6. Brand gradient

Primary expressive gradient:

```text
#3072FF → #6898FF
```

Use for:
- selected progress
- selected study states
- hero/empty-state accents
- occasional visual emphasis

Do not use gradients for every button or surface.

## 7. Expressive content colors

External gradient palettes may be used for decorative content categories such as:
- course folders
- flashcard categories
- study pack covers
- empty-state illustrations

They are not replacements for the semantic application palette.

Store expressive colors as data:

```ts
type VisualAccent = {
  background: string
  foreground: string
  gradient?: string
}
```

Do not allow external palette choices to redefine `primary`, `background`, `foreground`, `destructive`, or `border`.

## 8. Radius

The interface is deliberately rounded.

Primary values:

```text
control-sm   ≈ 8px
control      ≈ 12px
card         ≈ 24px
surface      ≈ 24px
hero         ≈ 40px
pill         9999px
```

Use the shadcn base radius to derive smaller/larger tokens. Do not introduce dozens of one-off radii.

## 9. Typography

Typography should be:
- highly legible
- neutral
- generous in heading scale
- moderate in weight
- never excessively condensed

Use the project's chosen font Manrope consistently. Heading and body fonts should remain the same unless a later design decision explicitly introduces a display face. Use Inter sparingly for eyebrow text or as needed for metadata.

## 10. Borders and elevation

The product relies more on borders and surface contrast than heavy shadows.

Preferred:
- 1px subtle border
- surface color changes
- restrained shadow only where a floating layer needs separation

Avoid:
- large drop shadows
- glossy UI
- excessive glassmorphism

## 11. Icons

Use one icon family consistently through the application.

Current visual reference:
- light mode icon color: `#B0A8B8`
- dark mode icon color: `#6D6D6D`
- active/interactive icons may use semantic foreground/primary colors.

## 12. Motion

Use Framer Motion only.

Motion categories:
- enter/exit
- hover/tap
- accordion/dialog state
- list stagger
- progress/state transitions
- layout transitions when they materially improve comprehension

Avoid GSAP for this product.

Every animation must respect reduced-motion preferences.

## 13. Component states

Every interactive component should consider:
- default
- hover
- focus-visible
- active
- disabled
- loading
- success
- error
- empty where applicable

## 14. Accessibility

Do not sacrifice contrast or focus visibility for visual fidelity.

Focus indicators must remain visible in both themes.

## 15. shadcn integration

The project should use shadcn's CSS-variable approach rather than hard-coding Tailwind colors into each component.

The global CSS file is the bridge between:
- Synapse design tokens
- shadcn primitives
- Tailwind utilities
- dark mode

Feature components consume semantic utilities such as:

```text
bg-background
text-foreground
bg-card
border-border
text-muted-foreground
bg-primary
text-primary-foreground
```

Raw color values should be restricted to theme definitions and deliberate visual-accent data.

## 16. Design-to-code rule

Figma is the visual reference. This document is the implementation contract for the visual system.

If Figma changes:
1. update the design system;
2. update affected tokens/components;
3. update UI-UX documentation if behavior changes;
4. then implement.
