# Fomi: the decision trail

## 1. What problem was I trying to solve, and for whom?

I designed for a professional creative working on a continuing campaign. Their challenge is not producing a first image. It is keeping track of why one direction was chosen, what changed between iterations, and where to resume tomorrow. A typical generation feed makes each output feel disposable. The workspace makes the active frame, the composer, and its history visible together.

## 2. Three important UX decisions

**Keep the current frame large.** The center of the screen belongs to the work itself. Controls and history support judging an image instead of competing with it. On narrow screens, the composer becomes an explicit panel so the frame remains readable.

**Make each exploration a decision.** Every result retains its prompt, direction, output type, and frame. “Use as starting point” brings those settings back into the composer. This reduces the work of reconstructing an earlier idea and encourages deliberate iteration.

**Limit comparison to two.** A pair supports a concrete choice without turning the workspace into a dense asset manager. The user selects two related directions and sees them side by side with their prompts. The interface keeps that action close to the output cards.

## 3. What I left out

I omitted a model marketplace, a large preset library, social discovery, node graphs, and nested parameter panels. Those would compete with the core work of developing and evaluating a visual direction. I also did not pretend the mock backend produces real AI media: the sample outputs and motion preview are labeled as a demo. With a real generation service, the API route can be replaced without changing the workspace structure.

## 4. Inspiration and improvement

The supplied references informed the design: Krea's prompt-centered creation flow, Higgsfield's immersive result review, and Magnific's visible controls for professionals. The Part A route follows the supplied Fomi mockup closely. For Part B, I wanted to improve continuity: the prompt and settings should travel with each visual, and a returning creator should immediately understand how the project arrived at its current frame.

## 5. With another month

I would connect a real image and video generation service with cancellation, progress updates, and failure recovery. I would test the decision trail with working art directors, then add project persistence, team annotations, and stronger reference-image handling. I would also measure keyboard usage and the time it takes a returning creator to resume a previous direction.

## 6. Differentiating workflow

**Decision trail** is the central idea. Instead of a chronological pile of media, each output remains connected to the intent and settings that made it. Selecting an earlier decision and using it as a starting point turns history into an active creative tool. The interface is built to help professionals continue a line of thought, not just generate another tile.

## Engineering trade-offs

Both tasks live in one Next.js app but are separate routes with separate CSS Modules. A shared local API keeps the prototype interactive and easy to replace. The build uses `next/image`, semantic controls, visible focus styles, reduced-motion support, and responsive layout changes. The demonstration uses local assets so its visual quality does not depend on third-party image hosts.
