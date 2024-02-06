import Link from 'next/link';
import { useContext } from 'react';
import AutocompleteContext from './AutocompleteContext';
import Image from '../Image';

const AutocompleteMenu = () => {
  const {
    hints,
    activeIndex,
    getItemProps,
    listRef,
    setOpen,
    setInputValue,
    refs,
  } = useContext(AutocompleteContext);

  let index = 0;
  return (
    <>
      {hints?.length ? (
        hints.map((section) => {
          return (
            <div key={section.title}>
              <h2 className="p-2 font-bold text-gray-600">{section.title}</h2>

              <ul>
                {section.items.map((item) => {
                  const currIndex = index;
                  index++;
                  return (
                    <li
                      aria-selected={activeIndex === currIndex}
                      role="option"
                      id={item._id}
                      key={item._id}
                      className="cursor-pointer p-2 hover:bg-gray-100 aria-selected:bg-gray-100"
                      {...getItemProps({
                        ref(node) {
                          listRef.current[currIndex] = node as HTMLElement;
                        },
                        onClick() {
                          setInputValue(item.name);
                          setOpen(false);
                          (refs.reference?.current as HTMLInputElement).focus();
                        },
                      })}
                    >
                      <Link
                        href={
                          'brewery' in item
                            ? `/cervezas/${item._id}`
                            : `/cervecerias/${item._id}`
                        }
                        legacyBehavior
                      >
                        <div className="flex min-h-[48px] items-center gap-2">
                          <div className="relative aspect-square w-12">
                            <Image
                              fill
                              src={item.profileImage}
                              alt=""
                              className="object-cover"
                            ></Image>
                          </div>
                          <div>
                            <h2 className="font-bold">{item.name}</h2>
                            {'brewery' in item ? (
                              <p>{item.brewery.name}</p>
                            ) : null}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })
      ) : (
        <div className="flex min-h-[7rem] items-center justify-center p-4 lg:min-h-[13.125rem]">
          <h2 className=" text-lg font-bold">No hemos encontrado resultados</h2>
        </div>
      )}
    </>
  );
};

export default AutocompleteMenu;
