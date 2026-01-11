import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import React from 'react';

function CommandList({ items, command, selectedIndex }) {
  return (
    <div className="SlashMenu" role="listbox">
      {items.length === 0 ? <div className="SlashEmpty">No results</div> : null}
      {items.map((item, index) => (
        <button
          key={item.title}
          type="button"
          className={index === selectedIndex ? 'SlashItem isActive' : 'SlashItem'}
          onClick={() => command(item)}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <div className="SlashItemTitle">{item.title}</div>
          <div className="SlashItemDesc">{item.description}</div>
        </button>
      ))}
    </div>
  );
}

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: true,
      },
    };
  },

  addProseMirrorPlugins() {
    const editor = this.editor;

    const items = ({ query }) => {
      const all = [
        {
          title: 'Heading 1',
          description: 'Big section title',
          command: () => editor.commands.setNode('heading', { level: 1 }),
        },
        {
          title: 'Heading 2',
          description: 'Medium section title',
          command: () => editor.commands.setNode('heading', { level: 2 }),
        },
        {
          title: 'Heading 3',
          description: 'Small section title',
          command: () => editor.commands.setNode('heading', { level: 3 }),
        },
        {
          title: 'Bullet List',
          description: 'Create a bulleted list',
          command: () => editor.commands.toggleBulletList(),
        },
        {
          title: 'Numbered List',
          description: 'Create a numbered list',
          command: () => editor.commands.toggleOrderedList(),
        },
        {
          title: 'Checklist',
          description: 'Track tasks with checkboxes',
          command: () => editor.commands.toggleTaskList(),
        },
        {
          title: 'Quote',
          description: 'Capture a quote',
          command: () => editor.commands.toggleBlockquote(),
        },
        {
          title: 'Code Block',
          description: 'Add a code snippet',
          command: () => editor.commands.setCodeBlock(),
        },
      ];

      const q = query?.toLowerCase() || '';
      return all.filter((i) => i.title.toLowerCase().includes(q)).slice(0, 8);
    };

    return [
      Suggestion({
        editor,
        char: this.options.suggestion.char,
        startOfLine: this.options.suggestion.startOfLine,
        items,
        command: ({ editor: ed, range, props }) => {
          ed.chain().focus().deleteRange(range).run();
          props.command();
        },
        render: () => {
          let component;
          let popup;
          let selectedIndex = 0;
          let currentItems = [];

          const onKeyDown = (props) => {
            if (props.event.key === 'ArrowDown') {
              selectedIndex = (selectedIndex + 1) % currentItems.length;
              component.updateProps({
                items: currentItems,
                selectedIndex,
                command: (item) => props.command(item),
              });
              return true;
            }

            if (props.event.key === 'ArrowUp') {
              selectedIndex = (selectedIndex - 1 + currentItems.length) % currentItems.length;
              component.updateProps({
                items: currentItems,
                selectedIndex,
                command: (item) => props.command(item),
              });
              return true;
            }

            if (props.event.key === 'Enter') {
              if (!currentItems[selectedIndex]) return false;
              props.command(currentItems[selectedIndex]);
              return true;
            }

            return false;
          };

          return {
            onStart: (props) => {
              currentItems = props.items;
              selectedIndex = 0;

              component = new ReactRenderer(CommandList, {
                props: {
                  items: props.items,
                  selectedIndex,
                  command: (item) => props.command(item),
                },
                editor: props.editor,
              });

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                theme: 'listem',
              });
            },

            onUpdate: (props) => {
              currentItems = props.items;
              selectedIndex = 0;
              component.updateProps({
                items: props.items,
                selectedIndex,
                command: (item) => props.command(item),
              });

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
              }

              if (currentItems.length === 0) return false;
              return onKeyDown(props);
            },

            onExit: () => {
              popup?.[0]?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
