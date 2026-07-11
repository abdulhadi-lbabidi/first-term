# Vercel Hotels Design System

## Overview

Vercel Hotels is a premium luxury hospitality platform designed for a multi-branch hotel chain. The experience combines modern boutique hotel aesthetics with a seamless digital booking journey.

The visual language is inspired by contemporary luxury resorts:
- warm neutral surfaces
- architectural photography
- elegant typography
- minimal interfaces
- premium hospitality feeling

The canvas is built around warm ivory tones (`{colors.canvas}` — #F5F1E8) with deep espresso ink (`{colors.ink}` — #2B241C). 

A single luxury accent — Vercel Gold (`{colors.primary}` — #B79A5A) — carries all important interactions:
- booking actions
- selected states
- premium badges
- highlights

The design avoids aggressive colors. Luxury comes from:
- whitespace
- photography
- typography
- subtle borders
- elegant spacing


## Brand Personality

Vercel Hotels represents:

- Timeless Luxury
- Calm Confidence
- Premium Hospitality
- Modern Comfort
- Attention To Detail


If Vercel Hotels was a person:

A sophisticated traveler in their late 30s:
- elegant
- calm
- detail oriented
- values quality over quantity
- appreciates architecture, design and comfort


## Key Characteristics

- Photography-first experience: hotel images create the emotional connection.
- Warm luxury palette instead of cold corporate colors.
- Minimal typography hierarchy.
- Rounded surfaces inspired by modern boutique hotels.
- Premium booking flow with minimal friction.
- Arabic and English experiences share the same design language.


# Colors


## Brand & Accent

### Vercel Gold

`{colors.primary}`

#B79A5A

Main luxury accent.

Used for:
- Primary booking buttons
- Active filters
- Selected dates
- Premium labels
- Rating highlights


### Gold Hover

`{colors.primary-hover}`

#967B43

Used for:
- button hover
- active states


### Gold Soft

`{colors.primary-soft}`

#E8DDC5

Used for:
- selected backgrounds
- badges

# Surface


## Canvas

`{colors.canvas}`

#F5F1E8

Main page background.

Used for:
- homepage
- rooms page
- editorial sections


## Surface White

`{colors.surface}`

#FFFFFF

Used for:
- room cards
- booking cards
- forms


## Surface Soft

`{colors.surface-soft}`

#EEE8DA

Used for:
- filters
- secondary sections

# Text


## Ink

`{colors.ink}`

#2B241C

Primary text.

Used for:
- headings
- navigation
- room names


## Body

`{colors.body}`

#544A3D

Paragraph text.


## Muted

`{colors.muted}`

#817568

Secondary information:
- room details
- dates
- metadata

# Borders


## Hairline

`{colors.border}`

#DDD3C2

Default borders.


## Strong Border

`{colors.border-strong}`

#BFAF92

# Semantic Colors


## Success

#4D7C5A

Used for:
- paid bookings
- confirmed reservations


## Error

#B94A48

Used for:
- validation errors

# Typography


## Font Philosophy

Vercel Hotels uses an editorial luxury typography system inspired by premium hotels, architecture magazines, and boutique hospitality brands.

Typography should feel:

- Elegant
- Calm
- Timeless
- Premium
- Highly readable


The system uses different fonts for display and interface content.

Large headlines create the luxury feeling, while interface text remains clean and functional.


---

# Font Families


## English Typography


### Display Font

**Cormorant Garamond**

Usage:

- Hero headlines
- Hotel name
- Section titles
- Premium room names
- Editorial statements


Characteristics:

- Elegant serif
- Luxury magazine feeling
- Architectural and timeless


Example:

"Experience Timeless Luxury"


Weights:

- 400 Regular
- 500 Medium
- 600 SemiBold
- 700 Bold



---

### Interface Font

**Inter**

Usage:

- Navigation
- Buttons
- Forms
- Booking details
- Prices
- Filters
- User dashboard


Characteristics:

- Modern
- Clean
- Highly readable


Weights:

- 400 Regular
- 500 Medium
- 600 SemiBold



---

# Arabic Typography


## Arabic Display Font

**Noto Kufi Arabic**

Usage:

- Hero Arabic headlines
- Hotel titles
- Section headings
- Premium statements


Characteristics:

- Modern Arabic geometry
- Luxury architectural feeling
- Excellent RTL balance


Weights:

- 400 Regular
- 500 Medium
- 600 SemiBold
- 700 Bold



Example:

"تجربة إقامة استثنائية"


---

## Arabic Interface Font

**IBM Plex Sans Arabic**

Usage:

- Navigation
- Buttons
- Forms
- Booking information
- Room descriptions
- User dashboard


Characteristics:

- Professional
- Clear
- Comfortable for long reading


Weights:

- 400 Regular
- 500 Medium
- 600 SemiBold



---

# Typography Hierarchy


| Token | English Font | Arabic Font | Size | Weight | Usage |
|---|---|---|---|---|---|
| display-xl | Cormorant Garamond | Noto Kufi Arabic | 64px | 600 | Hero headline |
| display-lg | Cormorant Garamond | Noto Kufi Arabic | 48px | 600 | Main sections |
| heading-xl | Cormorant Garamond | Noto Kufi Arabic | 36px | 600 | Page titles |
| heading-lg | Inter | IBM Plex Sans Arabic | 24px | 600 | Room titles |
| heading-md | Inter | IBM Plex Sans Arabic | 20px | 500 | Card titles |
| body-lg | Inter | IBM Plex Sans Arabic | 18px | 400 | Descriptions |
| body-md | Inter | IBM Plex Sans Arabic | 16px | 400 | Default text |
| body-sm | Inter | IBM Plex Sans Arabic | 14px | 400 | Metadata |
| caption | Inter | IBM Plex Sans Arabic | 12px | 500 | Labels |
| button | Inter | IBM Plex Sans Arabic | 15px | 500 | Actions |


---

# Letter Spacing


## English

Display:

-0.02em


Body:

0


Uppercase labels:

0.08em



## Arabic

No negative letter spacing.

Use natural Arabic spacing.


---

# Typography Rules


1. Never use heavy bold typography everywhere.

2. Luxury comes from:
   - whitespace
   - photography
   - serif headlines

3. Headlines should feel like a hotel magazine.

4. Booking interfaces must prioritize readability.

5. Arabic and English should have equal visual importance.


---

# Font Loading


Google Fonts:


English:

Cormorant Garamond

Inter


Arabic:

Noto Kufi Arabic

IBM Plex Sans Arabic


Recommended preload:

Display fonts first for hero rendering.

Interface fonts second for application content.

# Typography Scale


| Token | Size | Weight | Usage |
| display-xl | 64px | 600 | Hero title |
| display-lg | 48px | 600 | Main sections |
| heading-xl | 32px | 600 | Page titles |
| heading-lg | 24px | 600 | Room names |
| heading-md | 20px | 500 | Card titles |
| body-lg | 18px | 400 | Description |
| body-md | 16px | 400 | Default text |
| body-sm | 14px | 400 | Metadata |
| caption | 12px | 500 | Labels |
| button | 15px | 500 | CTA text |

# Layout


## Spacing System

Base unit:

4px


Tokens:

```

xs       8px
sm       16px
md       24px
lg       32px
xl       48px
section 80px

```

# Container


Maximum width:

1280px


Desktop:

Centered content.

Mobile:

16px horizontal padding.

# Grid


## Homepage

Structure:

```

Hero
↓
Featured Rooms
↓
Branches
↓
Services
↓
About
↓
Contact

```

# Hero Section


Large hotel image.

Overlay:

Dark transparent layer.

Content:

```

Vercel Hotels

Experience Timeless Luxury

Premium stays designed around comfort
and exceptional hospitality.

[Book Now]

```


Hero height:

720px desktop

# Components


# Buttons


## button-primary


Luxury gold background.

```

background: #B79A5A

color:white

radius:999px

height:48px

padding:16px 32px

```


Used for:

- Book Now
- Confirm Booking
- Payment

## button-secondary


White background.

Gold border.

Used for:

- View Details
- Cancel

# Navigation


## top-navbar


Height:

80px


Structure:

```

Logo

Home
Rooms
Branches
About
Contact

Language

Login

```


Style:

- transparent on hero
- white background on scrolling

# Room Card


Photo-first card.

Structure:

```

Image

Room Name

★★★★★

Size
Bed Count
Room Number

Price/night

Book Now

```


Properties:

Radius:

16px


Shadow:

soft only


```

0 8px 30px rgba(0,0,0,.08)

```

# Room Detail


Layout:

Desktop:

```

Image Gallery      Booking Panel
60%                40%

```


Information:

- Room name
- Number
- Branch
- Size
- Stars
- Amenities
- Price

# Booking Component


## Date Selector


Rounded calendar.

Selected:

Gold circle.


Flow:


```

Select Room

↓

Choose Dates

↓

Confirm Guests

↓

Payment

↓

Reservation

```

# Reservation Card


White surface.

Radius:

20px


Contains:


```

Room

Dates

Guests

Price breakdown

Confirm Booking

```

# Filters


Room filtering:

```

Branch

Price Range

Room Size

Stars

Availability

```


Desktop:

Sidebar


Mobile:

Bottom sheet

# Forms


## Input


Style:

White surface

Border:

1px solid #DDD3C2


Radius:

12px


Height:

52px


Focus:

Gold border.

# Authentication


Pages:

- Login
- Register
- Forgot Password


Style:

Centered card.

# Booking Status


## Confirmed

Green badge.


## Pending

Gold badge.


## Cancelled

Red badge.

# Footer


Luxury editorial footer.


Columns:


```

Vercel Hotels

Branches

Services

Support

Social

```


Background:

#2B241C


Text:

#F5F1E8

# Responsive Behavior


| Device | Changes |
| |-|-|
| Mobile | Navbar collapses, cards stack, filters become drawer |
| Tablet | Two-column rooms grid |
| Desktop | Full luxury layout |

# Motion


Animations are subtle.


Use:

Framer Motion


Examples:


Room cards:

Fade + translateY


Hero:

Slow image reveal


Buttons:

Smooth color transition


Avoid:

- bouncing
- excessive effects

# Accessibility


- Contrast AA+
- Keyboard navigation
- RTL support
- Clear focus states

# Technology


Frontend:

```

Vite
React
TypeScript
Tailwind CSS
React Router
Redux Toolkit
React Hook Form
Zod
i18next
Framer Motion
Lucide React

```

# Design Philosophy


Vercel Hotels should feel like:

"When a guest opens the website, they already feel inside the hotel."


The interface is not a booking tool only.

It is a digital entrance to a luxury experience. 



## Typography

### English

Display:
Playfair Display

Body:
Inter


### Arabic

Display:
Noto Naskh Arabic

Body:
Tajawal


The system uses elegant serif typography for luxury headlines
and clean sans-serif typography for usability and booking flows.
