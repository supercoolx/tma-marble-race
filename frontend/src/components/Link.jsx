import { classNames, useUtils } from '@telegram-apps/sdk-react';
import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

/**
 * @param {import('react-router-dom').LinkProps} props
 * @return {JSX.Element}
 */
export function Link({
  className,
  propsOnClick,
  to,
  ...rest
}) {
  const utils = useUtils();

  const onClick = useCallback((e) => {
    propsOnClick?.(e);

    // Compute if target path is external. In this case we would like to open link using
    // TMA method.
    let path;
    if (typeof to === 'string') {
      path = to;
    } else {
      const { search = '', pathname = '', hash = '' } = to;
      path = `${pathname}?${search}#${hash}`;
    }

    const targetUrl = new URL(path, window.location.toString());
    if (targetUrl.host === 't.me') {
      e.preventDefault();
      return utils.openTelegramLink(targetUrl.toString());
    }

    const currentUrl = new URL(window.location.toString());
    const isExternal = targetUrl.protocol !== currentUrl.protocol
      || targetUrl.host !== currentUrl.host;

    if (isExternal) {
      e.preventDefault();
      return utils.openLink(targetUrl.toString());
    }
  }, [to, propsOnClick, utils]);

  return (
    <RouterLink
      {...rest}
      to={to}
      onClick={onClick}
      className={classNames(className, 'link')}
    />
  );
}
