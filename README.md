# linter-api-blueprint
[![Circle CI](https://circleci.com/gh/zdne/linter-api-blueprint.svg?style=svg)](https://circleci.com/gh/zdne/linter-api-blueprint)

Atom Linter for [API Blueprint][]

This linter plugin for [Linter][]
provides interface to API Blueprint parser ([Drafter][]).

## Usage
Files with the `.apib` extension are validated on the flight.

To access raw parser result use the `ctrl+option+p` commands shortcut. See
Refract [Parse Result Namespace][] for description of the output.

## Installation

```
apm install linter-api-blueprint
```

This plugin requires [Linter][] and [API Blueprint Grammar for Atom](https://atom.io/packages/language-api-blueprint) installed.

```
apm install linter
apm install language-api-blueprint
```

**Note:** The installation may take some time as it includes building of the API
Blueprint parser from its sources.

## Contribution

Much needed. Fork & pull request.

[API Blueprint]: https://github.com/apiaryio/api-blueprint
[Linter]: https://github.com/atom-community/linter
[Drafter]: https://github.com/apiaryio/drafter-npm
[Parse Result Namespace]: https://github.com/refractproject/refract-spec/blob/master/namespaces/parse-result-namespace.md
