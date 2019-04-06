# Scraping script assumptions

## Legend

`FLOD` - first line of description, containing job offer details divided by `|` into groups. Any comment not fitting this criteria is omitted

`*` - required fields

## What to scrape

Only scrape job offers which specify details in `FLOD`. This is due to avoid comments not containing actual offers and offers missing important details.

## Parse sequence

We search groups of `FLOD` to find specified properties. Following list is parsed in order, if there's a match we remove specific group to avoid parsing it twice

### remote

We search for any group containing word `remote` or `onsite`. Search is case insensitive and removes special characters to avoid cases like `on-site`. If offer doesn't specify it directly we assume there's no possibility of remote work.

### position\* - with tags

We search for any group containing predefiend tags. Any tags matching specified groups are saved together with with position itself. This one can remove multiple groups. See `position-tags.ts` for list of all possible tags.

### salary - range and currency

We search for line containing at least two consecutive digits and currency sing in order to parse `minSalary`, `maxSalary` and `currency` properties. If there's only one number we set it for both `minSalary` and `maxSalary`. We assume that all salaries are specified as total annual income and in case there would be 4 or more digits, we normalize it to such value (eg. 120000 would become 120). Also we consider on offers with USD (\$) or EUR (€) currencies.

### company name\*

We asume that company name should be stated in first group of all left groups of `FLOD` (of those groups which are left after previous searches)
