import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  overlayClassName = "bg-black/20 backdrop-blur-xs",
  sizeClass = "max-w-md",
  source,
}) {
  useBodyModalClass(open);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-9999 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`fixed inset-0 z-9999 ${overlayClassName}`}
              aria-hidden="true"
              onClick={onClose}
            />
          </Transition.Child>
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className={`inline-block w-full ${sizeClass} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative z-10000`}
              data-modal-source={source}
            >
              {title && (
                <Dialog.Title as="h3" className="text-lg font-semibold mb-2">
                  {title}
                </Dialog.Title>
              )}
              <div>{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

function useBodyModalClass(open) {
  useEffect(() => {
    let removeTimer;
    if (open) {
      const t = window.setTimeout(
        () => document.body.classList.add("modal-open"),
        10,
      );
      return () => window.clearTimeout(t);
    } else {
      removeTimer = window.setTimeout(
        () => document.body.classList.remove("modal-open"),
        200,
      );
      return () => {
        if (removeTimer) window.clearTimeout(removeTimer);
      };
    }
  }, [open]);
}
