export default {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'price',
      title: 'Price Label',
      type: 'string',
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'style',
      title: 'Card Style',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (flagship)', value: 'dark' },
          { title: 'Light', value: 'light' },
          { title: 'Accent (lime)', value: 'accent' },
        ],
      },
      initialValue: 'light',
    },
    {
      name: 'colSpan',
      title: 'Column Span',
      type: 'number',
      initialValue: 1,
      description: 'How many grid columns this card spans (1 or 2)',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
}
