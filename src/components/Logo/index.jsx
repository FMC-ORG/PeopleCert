const Logo = () => (
  <div className="flex items-center gap-2.5 select-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 64 64"
      className="shrink-0"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="12" className="fill-peoplecert-navy dark:fill-white" />
      <path
        d="M16 18h16.5c6.9 0 11.5 3.9 11.5 10.2 0 6.4-4.6 10.3-11.8 10.3H24V50h-8V18zm8 14.3h7.5c3 0 4.9-1.4 4.9-4 0-2.7-1.9-4.1-4.9-4.1H24v8.1z"
        className="fill-peoplecert-orange"
      />
    </svg>
    <div className="leading-tight">
      <div className="text-[17px] font-extrabold tracking-tight text-peoplecert-navy dark:text-white">
        PeopleCert
      </div>
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-peoplecert-orange">
        Support Center
      </div>
    </div>
  </div>
);

export default Logo;
