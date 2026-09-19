/*
 * Alo Solar Energy — multilingual solar knowledge base
 * This assistant gives general educational guidance. Final electrical design,
 * protection settings and installation must be confirmed after a site survey.
 */
(function () {
  const topics = [
    {
      keys:['mppt','maximum power point','string voltage','solar string','ستڕینگ','سترینگ','ئێم پی پی تی','mppt چیست','سلسلة الألواح','جهد السلسلة'],
      en:`MPPT and solar strings\n• A string is a group of panels connected in series. Series connection increases voltage while current stays approximately the same.\n• An MPPT continuously finds the operating voltage that extracts the best available power from the panels.\n• Every string must remain inside the inverter’s MPPT voltage range, maximum DC voltage and current limits in both hot and cold weather.\n• Panels connected to one MPPT should normally have the same model, direction, tilt and shading conditions. Different roof directions are better placed on separate MPPT inputs.\nFinal string length must be checked from the panel Voc/Vmp/current and the exact inverter datasheet before connection.`,
      ku:`MPPT و ستڕینگی پانێڵ\n• ستڕینگ کۆمەڵێک پانێڵە کە بە زنجیرەیی پێکەوە دەبەسترێن؛ ڤۆڵتاژ زیاد دەبێت و ئەمپێر نزیکەی هەمان دەمێنێتەوە.\n• MPPT بەردەوام خاڵی باشترین بەرهەمهێنانی پانێڵەکان دەدۆزێتەوە.\n• ڤۆڵتاژ و ئەمپێری هەر ستڕینگێک دەبێت لە سنووری MPPT، زۆرترین DC voltage و DC current ـی ئینڤێرتەر دابێت، لە گەرما و ساردیشدا.\n• پانێڵەکانی یەک MPPT باشترە هەمان مۆدێل، ئاراستە، گۆشە و دۆخی سێبەریان هەبێت. ئاراستە جیاوازەکان بخەرە MPPT ـی جیاواز.\nپێش بەستنەوە، ژمارەی ستڕینگ بە Voc و Vmp و ئەمپێری پانێڵ و داتاشیتی ئینڤێرتەر پشتڕاست بکرێتەوە.`,
      ar:`MPPT وسلاسل الألواح\n• السلسلة هي مجموعة ألواح موصولة على التوالي؛ يرتفع الجهد بينما يبقى التيار متقارباً.\n• يتتبع MPPT نقطة التشغيل التي تعطي أفضل قدرة متاحة من الألواح.\n• يجب أن يبقى جهد وتيار كل سلسلة ضمن مجال MPPT والحد الأعلى لجهد وتيار DC في العاكس صيفاً وشتاءً.\n• يفضّل أن تكون ألواح المدخل الواحد من الطراز والاتجاه والميل وظروف الظل نفسها، وتوضع الاتجاهات المختلفة على مداخل MPPT منفصلة.\nيجب تأكيد طول السلسلة من Voc وVmp والتيار وداتا شيت العاكس قبل التوصيل.`
    },
    {
      keys:['shade','shading','shadow','سێبەر','سایە','ظل','تظليل'],
      en:`Shading can reduce production much more than its covered area suggests because panels contain series-connected cells. Good design avoids shadows from water tanks, walls, trees, antennas and nearby rows during the important solar hours. Separate differently shaded roof areas on different MPPTs when possible. Bypass diodes help, but they do not make shading harmless. Optimizers may help in complex roofs, after a proper technical assessment.`,
      ku:`سێبەر دەتوانێت بەرهەم زۆرتر لە ڕێژەی شوێنە داپۆشراوەکە کەم بکات، چونکە خانەکانی پانێڵ زنجیرەیین. دیزاینی باش سێبەری تانکی ئاو، دیوار، دار، ئەنتێن و ڕیزی دیکە لە کاتە گرنگەکانی خۆردا دوور دەخاتەوە. ئەگەر بکرێت، بەشە جیاوازە سێبەردارەکان بخەرە MPPT ـی جیاواز. Bypass diode یارمەتیدەرە، بەڵام زیانی سێبەر بە تەواوی لابەر ناکات.`,
      ar:`قد يخفض الظل الإنتاج بنسبة أكبر من المساحة المغطاة لأن خلايا اللوح متصلة على التوالي. يجب تجنب ظلال خزانات الماء والجدران والأشجار والهوائيات والصفوف المجاورة خلال ساعات الشمس المهمة. يفضّل فصل الأسطح المختلفة في الظل على مداخل MPPT مستقلة. تساعد صمامات التجاوز، لكنها لا تلغي أثر الظل تماماً.`
    },
    {
      keys:['lifepo4','lithium','lead acid','battery type','باتری لیتیۆم','پاتری لیتیۆم','جۆری باتری','ليثيوم','نوع البطارية','رصاص'],
      en:`Battery technology\n• LiFePO₄ batteries are widely used in modern solar systems because of their useful cycle life, high efficiency, stable chemistry and deeper usable capacity.\n• The BMS monitors cell voltage, temperature, current and protection limits; communication between battery and inverter should use a supported protocol.\n• Lead-acid batteries usually need more ventilation and maintenance and should not be deeply discharged regularly.\nChoose by usable kWh, continuous and peak current, cycle warranty, compatible inverter list, operating temperature and local technical support—not Ah alone.`,
      ku:`تەکنەلۆژیای باتری\n• باتری LiFePO₄ لە سیستەمی نوێدا زۆر بەکاردێت، چونکە تەمەنی سایکڵ، کارایی، جێگیری کیمیایی و بەشی بەکارهاتووی باشی هەیە.\n• BMS ڤۆڵتاژی خانەکان، گەرما، ئەمپێر و سنووری پاراستن چاودێری دەکات؛ پەیوەندی باتری و ئینڤێرتەر دەبێت بە پرۆتۆکۆڵێکی پشتگیریکراو بێت.\n• باترییەکانی lead-acid زۆرجار پێویستیان بە هەواگۆڕکێ و چاودێری زیاترە و نابێت بەردەوام قووڵ دابەزێندرێن.\nهەڵبژاردن بە usable kWh، ئەمپێری بەردەوام و لەناکاو، سایکڵ، گەرەنتی، گونجان لەگەڵ ئینڤێرتەر، گەرما و پشتیوانی ناوخۆیی بکە؛ تەنها Ah بەس نییە.`,
      ar:`تقنية البطاريات\n• تنتشر بطاريات LiFePO₄ في الأنظمة الحديثة بسبب عمر الدورات والكفاءة والاستقرار والسعة القابلة للاستخدام.\n• يراقب BMS جهد الخلايا والحرارة والتيار وحدود الحماية، ويجب أن يتم الاتصال مع العاكس ببروتوكول مدعوم.\n• تحتاج بطاريات الرصاص عادةً إلى تهوية وصيانة أكبر ولا يناسبها التفريغ العميق المتكرر.\nتتم المقارنة حسب الطاقة القابلة للاستخدام kWh، والتيار المستمر واللحظي، والدورات والضمان والتوافق والحرارة والدعم، وليس Ah وحده.`
    },
    {
      keys:['soc','state of charge','dod','depth of discharge','سۆک','ئاستی پڕبوون','قووڵی دابەزین','نسبة الشحن','عمق التفريغ'],
      en:`SOC is the estimated percentage of charge remaining. DoD is the percentage already used. A battery at 30% SOC has used roughly 70% of its charge. Usable energy is less than the nominal rating because the manufacturer and BMS reserve safe limits. Avoid keeping lithium batteries at extremely low charge, excessive heat or maximum charge for unnecessarily long periods. Follow the battery maker’s recommended minimum SOC and charge/discharge current.`,
      ku:`SOC ڕێژەی خەمڵێنراوی شارژی ماوەیە و DoD ڕێژەی بەکارهاتووە. بۆ نموونە، 30% SOC واتە نزیکەی 70% شارژ بەکارهاتووە. وزەی بەکارهاتوو لە قەبارەی ناونیشان کەمترە، چونکە کۆمپانیا و BMS سنووری پارێزراو دادەنێن. باتری لیتیۆم بۆ ماوەی زۆر لە شارژی زۆر نزم، گەرمای زۆر یان 100% مەهێڵەوە؛ ڕێنمایی minimum SOC و charge/discharge current ـی بەرهەمهێنەر جێبەجێ بکە.`,
      ar:`SOC هو النسبة التقديرية للشحن المتبقي، وDoD هو الجزء المستهلك. بطارية عند 30% SOC استُخدم منها تقريباً 70%. الطاقة القابلة للاستخدام أقل من الاسمية لأن الشركة وBMS يتركان حدود أمان. تجنب إبقاء بطارية الليثيوم عند شحن منخفض جداً أو حرارة عالية أو 100% لفترات غير ضرورية، واتبع حدود التيار وSOC التي تحددها الشركة.`
    },
    {
      keys:['battery size','battery sizing','battery capacity','size battery','حەجمی باتری','قەبارەی باتری','باتری چەند','سعة البطارية','حجم البطارية'],
      en:`Battery sizing starts with the essential night/outage loads in watts and the required backup hours. Energy needed is roughly load × hours, then adjusted for inverter losses, usable depth of discharge, temperature and a safety margin. The battery must also supply the starting surge of motors, pumps, refrigerators and air conditioners. A site load list and measured consumption are more reliable than choosing from battery Ah alone.`,
      ku:`قەبارەی باتری بە لیستی بارە گرنگەکانی شەو و کاتی پچڕان بە وات، و ژمارەی کاتژمێری پشتیوانی دەست پێدەکات. وزەی پێویست بە نزیکەیی = بار × کات، پاشان زیانی ئینڤێرتەر، usable DoD، گەرما و پاشەکەوتی پاراستن لەبەرچاو دەگیرێت. باتری دەبێت ئەمپێری دەستپێکی ماتۆڕ، پەمپ، سەلاجە و سپلیتیش دابین بکات. لیستی بار و پێوانەی بەکارهێنان لە تەنها Ah دروستترە.`,
      ar:`يبدأ حساب البطارية من أحمال الليل أو الانقطاع الضرورية بالواط وساعات الدعم المطلوبة. الطاقة التقريبية = الحمل × الزمن، ثم تضاف خسائر العاكس وعمق التفريغ المسموح والحرارة وهامش الأمان. ويجب أن تتحمل البطارية تيار بدء المحركات والمضخات والثلاجات والمكيفات. قائمة الأحمال والقياس الفعلي أدق من الاختيار حسب Ah وحده.`
    },
    {
      keys:['inverter size','inverter capacity','choose inverter','ئینڤێرتەر چەند','قەبارەی ئینڤێرتەر','اختيار العاكس','قدرة العاكس'],
      en:`Inverter sizing must consider simultaneous AC load, motor starting surge, phase type, battery voltage/current and the solar array’s DC voltage and power. A larger kW label alone does not guarantee compatibility. Check MPPT ranges, maximum PV input, output current, overload time, backup output, generator/grid compatibility and supported batteries. Three-phase loads need correct phase design and balancing.`,
      ku:`قەبارەی ئینڤێرتەر بە کۆی بارە AC ـە هاوکاتەکان، ئەمپێری دەستپێکی ماتۆڕ، جۆری فەیز، ڤۆڵتاژ و ئەمپێری باتری و ڤۆڵتاژ و توانای پانێڵ دیاری دەکرێت. تەنها ژمارەی kW گونجان مسۆگەر ناکات. سنووری MPPT، زۆرترین PV input، output current، overload time، backup output، گونجان لەگەڵ جەنەریتەر/تۆڕ و باتری بپشکنە. باری سێ فەیز پێویستی بە دیزاین و balance ـی دروست هەیە.`,
      ar:`يُختار العاكس حسب مجموع الأحمال المتزامنة، وتيار بدء المحركات، ونوع الطور، وجهد وتيار البطارية، وجهد وقدرة مصفوفة الألواح. رقم kW الأكبر لا يعني التوافق تلقائياً. يجب فحص مجال MPPT وأقصى دخل PV وتيار الخرج والتحمل المؤقت وخرج الأحمال الاحتياطية وتوافق الشبكة والمولد والبطاريات، مع موازنة صحيحة للأطوار الثلاثة.`
    },
    {
      keys:['how many panel','number of panel','panel size','solar size','system sizing','چەند پانێڵ','چەند لەوحە','قەبارەی پانێڵ','قەبارەی سیستەم','كم لوح','عدد الألواح','حجم النظام','حساب النظام'],
      en:`Solar-array sizing\n1. Measure daily energy consumption in kWh, preferably from bills or monitoring data.\n2. Separate daytime loads from night/backup loads.\n3. Account for local sun hours, heat, dust, shading, cable and inverter losses.\n4. Confirm roof area, orientation and structural condition.\n5. Verify string voltage/current against the inverter datasheet.\nPanel count is approximately required array watts ÷ panel watts, but the final number must satisfy both energy needs and inverter electrical limits.`,
      ku:`قەبارەکردنی پانێڵ\n1. بەکارهێنانی ڕۆژانە بە kWh بپێوە؛ داتای میتەر یان مۆنیتەرینگ باشترە.\n2. باری ڕۆژ لە باری شەو و backup جیا بکەرەوە.\n3. کاتژمێری خۆر، گەرما، خۆڵ، سێبەر و زیانی کێبڵ و ئینڤێرتەر لەبەرچاو بگرە.\n4. بۆشایی، ئاراستە و بەهێزی سەربان بپشکنە.\n5. ڤۆڵتاژ و ئەمپێری ستڕینگ بە داتاشیتی ئینڤێرتەر بگونجێنە.\nژمارەی سەرەتایی = توانای پێویستی کۆی پانێڵ ÷ واتی یەک پانێڵ؛ بەڵام ژمارەی کۆتایی دەبێت لەگەڵ پێداویستی وزە و سنووری ئینڤێرتەر بگونجێت.`,
      ar:`حساب مصفوفة الألواح\n1. قياس الاستهلاك اليومي kWh من الفاتورة أو المراقبة.\n2. فصل أحمال النهار عن أحمال الليل والاحتياط.\n3. احتساب ساعات الشمس والحرارة والغبار والظل وخسائر الكابل والعاكس.\n4. فحص مساحة السطح واتجاهه وحالته الإنشائية.\n5. مطابقة جهد وتيار السلاسل مع داتا شيت العاكس.\nالعدد التقريبي = قدرة المصفوفة المطلوبة ÷ قدرة اللوح، لكن العدد النهائي يجب أن يحقق الطاقة المطلوبة وحدود العاكس معاً.`
    },
    {
      keys:['dc protection','ac protection','breaker','fuse','spd','surge','protection board','پاراستنی dc','پاراستنی ac','فیوز','بریکر','حماية dc','حماية ac','قاطع','مانع الصواعق'],
      en:`Electrical protection is essential. A proper design may include correctly rated DC string fuses where required, DC isolators, DC and AC surge protection devices (SPD), AC breakers, residual-current protection where applicable, earthing and labelled distribution boards. Ratings must match voltage, current, polarity, fault level and local rules. DC arcs are dangerous and ordinary AC devices must never be substituted for DC-rated equipment.`,
      ku:`پاراستنی کارەبایی بنەڕەتییە. دیزاینی دروست بە پێی پێویستی DC string fuse، DC isolator، پارێزەری زیادبوونی ڤۆڵتاژ SPD بۆ DC و AC، بریکر، پاراستنی leakage، ئەرث و بۆردی ناونیشان‌کراو لەخۆدەگرێت. ڕەیتینگەکان دەبێت لەگەڵ ڤۆڵتاژ، ئەمپێر، polarity و fault level بگونجێن. ئاگری قەوسی DC مەترسیدارە؛ ئامێری AC لە شوێنی ئامێری تایبەتی DC بەکارمەهێنە.`,
      ar:`الحماية الكهربائية أساسية، وقد تشمل فيوزات سلاسل DC عند الحاجة، وقواطع عزل DC، ومانعات ارتفاع الجهد SPD للـDC والـAC، وقواطع AC، وحماية التسرب، والتأريض ولوحات واضحة التسميات. يجب أن تناسب التصنيفات الجهد والتيار والقطبية ومستوى القصر. قوس DC خطير ولا يجوز استبدال أجهزة DC بأجهزة AC عادية.`
    },
    {
      keys:['earth','earthing','grounding','ground','ئەرث','زەمینکردن','تەئریض','تأريض','ارضي'],
      en:`Earthing helps control touch voltage and gives protection devices a safe fault path. Panel frames, mounting structure, inverter chassis, protection boards and surge devices must be bonded according to the engineered design. Earthing is not a substitute for breakers or SPD, and neutral-to-earth bonding must follow the inverter mode and local electrical arrangement. Earth resistance should be measured—not guessed.`,
      ku:`ئەرث یارمەتی کۆنترۆڵی touch voltage دەدات و ڕێگایەکی پارێزراو بۆ fault دروست دەکات. چوارچێوەی پانێڵ، ستراکچەری هەڵگر، جەستەی ئینڤێرتەر، بۆرد و SPD دەبێت بە پێی دیزاینی ئەندازیاری پێکەوە ببەسترێن. ئەرث جێگرەوەی بریکر و SPD نییە، و بەستنی neutral-earth دەبێت لەگەڵ مۆدی ئینڤێرتەر و سیستەمی کارەبا بگونجێت. مقاومەتی ئەرث دەبێت بپێورێت.`,
      ar:`يساعد التأريض على الحد من جهد اللمس ويوفر مساراً آمناً للأعطال. يجب ربط هياكل الألواح والقواعد وجسم العاكس واللوحات وSPD وفق التصميم الهندسي. التأريض لا يغني عن القواطع أو SPD، وربط المحايد بالأرضي يعتمد على وضع العاكس ونظام الموقع. يجب قياس مقاومة الأرضي فعلياً.`
    },
    {
      keys:['cable size','size a cable','size cable','wire size','voltage drop','کێبڵ','وایەر','دابەزینی ڤۆڵتاژ','حجم الكابل','مقطع الكابل','هبوط الجهد'],
      en:`Cable size depends on current, system voltage, route length, installation method, ambient temperature, grouping and permitted voltage drop. Solar DC cable must be UV-, heat- and weather-resistant with compatible certified connectors. AC and battery cables can carry high current and require correct lugs, torque, protection and short practical routes. Cable size should be calculated; using a familiar size everywhere can cause losses, heat or fire.`,
      ku:`قەبارەی کێبڵ بە ئەمپێر، ڤۆڵتاژ، درێژی ڕێگا، شێوازی دانان، گەرمای دەوروبەر، کۆمەڵکردن و سنووری voltage drop پەیوەستە. کێبڵی DC ـی سۆلەر دەبێت بەرگەی UV و گەرما و کەش بگرێت و connector ـی بڕوانامەدار و گونجاوی هەبێت. کێبڵی AC و باتری ئەمپێری زۆر هەڵدەگرن و lug، torque، پاراستن و ڕێگای کورت پێویستە. قەبارە دەبێت حیساب بکرێت؛ یەک قەبارە بۆ هەموو شوێنێک دەتوانێت زیان، گەرما یان ئاگر دروست بکات.`,
      ar:`يعتمد مقطع الكابل على التيار والجهد والطول وطريقة التمديد والحرارة وتجميع الكابلات وهبوط الجهد المسموح. يجب أن يكون كابل DC الشمسي مقاوماً للشمس والحرارة والطقس وبموصلات متوافقة ومعتمدة. كابلات AC والبطارية تحمل تيارات عالية وتحتاج إلى كبسات وعزم شد وحماية ومسار مناسب. يجب حساب المقطع؛ استخدام قياس واحد دائماً قد يسبب خسارة وحرارة أو حريقاً.`
    },
    {
      keys:['clean','wash','dust','sand','خۆڵ','تۆز','پاک','پاککردن','شۆردن','غبار','تنظيف','غسل'],
      en:`Panel cleaning and dust\n• Check production trends and inspect panels regularly; there is no single cleaning interval for every site.\n• Clean when panels are cool, commonly early morning, using clean water and a soft non-abrasive tool.\n• Avoid thermal shock, pressure washers close to seals, harsh chemicals, metal tools and walking on panels.\n• Hard-water mineral deposits can also reduce light transmission.\nWork-at-height and electrical safety come first; use trained staff when roof access is unsafe.`,
      ku:`پاککردنەوەی پانێڵ و خۆڵ\n• بەرهەم بەدواداچوون بکە و پانێڵ بەردەوام بپشکنە؛ یەک خشتەی پاککردنەوە بۆ هەموو شوێنێک نییە.\n• کاتێک پانێڵ ساردە، زۆرجار بەیانی زوو، بە ئاوی پاک و ئامێری نەرم پاکی بکەرەوە.\n• لە ئاوی زۆر سارد لەسەر پانێڵی گەرم، pressure washer لە نزیک seal، مادەی توند، ئامێری ئاسن و ڕۆیشتن لەسەر پانێڵ دووربکەوە.\n• نیشتەجێبوونی کانزای ئاوی ڕەقیش ڕووناکی کەم دەکات.\nپاراستنی کارکردن لە بەرزی و کارەبا لە هەموو شتێک گرنگترە.`,
      ar:`تنظيف الألواح والغبار\n• راقب منحنى الإنتاج وافحص الألواح؛ لا توجد مدة تنظيف واحدة لكل المواقع.\n• نظف واللوح بارد، غالباً صباحاً، بماء نظيف وأداة ناعمة غير كاشطة.\n• تجنب الصدمة الحرارية والضغط العالي قرب العوازل والمواد القاسية والأدوات المعدنية والمشي على الألواح.\n• ترسبات الأملاح من الماء العسر قد تقلل الضوء أيضاً.\nسلامة العمل على السطح والكهرباء أولاً، واستعن بفنيين عند صعوبة الوصول.`
    },
    {
      keys:['hot','heat','summer','temperature','گەرما','هاوین','پلەی گەرمی','حرارة','صيف'],
      en:`Solar panels need sunlight, but high cell temperature reduces their voltage and instantaneous power. Good airflow under panels, suitable spacing and correct cable/inverter derating help in summer. Batteries and inverters should be installed in a dry, shaded, ventilated place within their permitted temperature range—not in direct sun or a sealed hot room. Never block inverter ventilation openings.`,
      ku:`پانێڵ تیشکی خۆری پێویستە، بەڵام گەرمای بەرزی cell ڤۆڵتاژ و توانای دەستبەجێ کەم دەکات. هەواگۆڕکێ لەژێر پانێڵ، بۆشایی گونجاو و derating ـی دروستی کێبڵ و ئینڤێرتەر لە هاویندا گرنگە. باتری و ئینڤێرتەر لە شوێنی وشک، سێبەردار و هەوادار لە سنووری گەرمای ڕێپێدراودا دابنێ؛ نە لەبەر خۆری ڕاستەوخۆ یان ژووری گەرم و داخراو. کونەکانی هەواگۆڕکێ مەگرە.`,
      ar:`تحتاج الألواح إلى الضوء، لكن ارتفاع حرارة الخلايا يخفض الجهد والقدرة اللحظية. يفيد مرور الهواء أسفل الألواح والتباعد الصحيح واحتساب خفض قدرة الكابلات والعاكس صيفاً. توضع البطارية والعاكس في مكان جاف ومظلل ومهوى ضمن مجال الحرارة المسموح، وليس تحت الشمس أو في غرفة حارة مغلقة، ولا تُحجب فتحات تهوية العاكس.`
    },
    {
      keys:['cloud','rain','winter','storm','lightning','هەور','باران','زستان','بروسکە','غيم','مطر','شتاء','صاعقة','برق'],
      en:`Panels still produce in cloudy weather from available light, but output is lower and varies with cloud density. Rain can remove loose dust but may not remove oily dirt or mineral deposits. Correct drainage, waterproof connectors, cable management, earthing and surge protection are important in storms. During lightning or flooding, do not touch wet electrical equipment; isolate only if it is safe and contact a qualified technician.`,
      ku:`پانێڵ لە هەواداویش لە ڕووناکی بەردەست بەرهەم دەهێنێت، بەڵام بەرهەم کەمترە و بە چڕی هەور دەگۆڕێت. باران خۆڵی شل دەبات، بەڵام پیسی چەور یان کانزای ئاوی ڕەق بە تەواوی نابات. drainage، connector ـی waterproof، ڕێکخستنی کێبڵ، ئەرث و SPD لە بروسکەدا گرنگن. لە کاتی بروسکە یان لافاو دەست لە ئامێری تەڕ مەدە؛ تەنها ئەگەر پارێزراوە isolate بکە و پەیوەندی بە تەکنیکی شارەزا بکە.`,
      ar:`تنتج الألواح في الجو الغائم من الضوء المتاح، لكن الإنتاج أقل ويتغير حسب كثافة الغيوم. قد يزيل المطر الغبار الخفيف، لكنه لا يزيل دائماً الأوساخ الزيتية أو الأملاح. التصريف الجيد والموصلات المحكمة وتنظيم الكابلات والتأريض وSPD مهمة أثناء العواصف. عند البرق أو الفيضان لا تلمس معدات مبللة؛ افصلها فقط إن كان ذلك آمناً واتصل بفني مختص.`
    },
    {
      keys:['maintenance','service','inspection','چاککردنەوە','چاودێری','پشکنین','صيانة','فحص'],
      en:`Preventive maintenance should review production history and alarms, panel condition and cleanliness, mounting corrosion/looseness, cable damage, connectors, protection boards, earthing, inverter ventilation and battery/BMS status. Thermal scanning and torque checks may be appropriate for commercial systems. Do not open live DC connectors or inverter/battery covers unless trained and authorized. Keep dates, alarms, readings and maintenance actions in a service record.`,
      ku:`چاودێری پێشوەختە دەبێت مێژووی بەرهەم و alarm، پاکی و دۆخی پانێڵ، شلی یان ژەنگی ستراکچەر، زیانی کێبڵ و connector، بۆردی پاراستن، ئەرث، هەواگۆڕکێی ئینڤێرتەر و دۆخی باتری/BMS بپشکنێت. thermal scan و torque check بۆ سیستەمی بازرگانی گونجاوە. connector ـی DC یان قاپی ئینڤێرتەر و باتری بە زیندوویی مەکەرەوە، مەگەر ڕاهێنراو و ڕێپێدراو بیت. تۆماری بەروار، alarm، خوێندنەوە و چاکسازی هەڵبگرە.`,
      ar:`تشمل الصيانة الوقائية مراجعة سجل الإنتاج والتنبيهات، ونظافة وحالة الألواح، وثبات الهيكل والصدأ، والكابلات والموصلات، ولوحات الحماية والتأريض، وتهوية العاكس وحالة البطارية وBMS. قد يفيد التصوير الحراري وفحص عزم الربط في الأنظمة التجارية. لا تفتح موصلات DC الحية أو أغطية العاكس والبطارية دون تدريب وصلاحية، واحتفظ بسجل للتواريخ والقراءات والتنبيهات والأعمال.`
    },
    {
      keys:['low production','not producing','production down','fault','error','alarm','بەرهەم کەم','کار ناکات','هەڵە','ئاگاداری','انتاج قليل','لا يعمل','خطأ','انذار'],
      en:`If production is unexpectedly low:\n1. Compare at the same time and similar weather—not only with yesterday.\n2. Check the monitoring app for alarms, grid status, PV voltage/current, battery SOC and load.\n3. Look safely for shading, heavy dirt, a tripped breaker or visible cable damage.\n4. Do not unplug DC connectors under load or repeatedly reset protection.\n5. Record the alarm code and readings, then contact technical support.\nLow production can result from weather, heat, clipping, grid limits, shading, dirt, string faults, protection trips or incorrect settings.`,
      ku:`ئەگەر بەرهەم بە چاوەڕواننەکراوی کەم بوو:\n1. لە هەمان کات و هەمان دۆخی کەشوهەوا بەراورد بکە، نەک تەنها لەگەڵ دوێنێ.\n2. alarm، دۆخی تۆڕ، PV voltage/current، SOC و load لە مۆنیتەرینگ ببینە.\n3. بە پارێزراوی سێبەر، خۆڵی زۆر، بریکرێکی پەڕیو یان زیانی دیاری کێبڵ بپشکنە.\n4. connector ـی DC لەژێر باردا مەکەرەوە و پاراستن بەردەوام reset مەکە.\n5. کۆدی alarm و خوێندنەوەکان تۆمار بکە و پەیوەندی بە تەکنیک بکە.\nهۆکار دەتوانێت کەش، گەرما، clipping، سنووری تۆڕ، سێبەر، خۆڵ، کێشەی string، پەڕینی پاراستن یان setting بێت.`,
      ar:`إذا انخفض الإنتاج بصورة غير متوقعة:\n1. قارن في الوقت نفسه ومع طقس مشابه.\n2. افحص التنبيهات وحالة الشبكة وجهد/تيار PV وSOC والحمل في المراقبة.\n3. افحص بأمان وجود ظل أو غبار كثيف أو قاطع مفصول أو تلف ظاهر.\n4. لا تفصل موصلات DC تحت الحمل ولا تكرر إعادة الحماية.\n5. سجل رمز الخطأ والقراءات واتصل بالدعم.\nقد يكون السبب الطقس أو الحرارة أو تحديد القدرة أو الشبكة أو الظل أو الغبار أو عطل سلسلة أو الحماية أو الإعدادات.`
    },
    {
      keys:['on-grid','on grid','ongrid','ئۆن گرید','ئۆنگرید','اون گريد','متصل بالشبكة'],
      en:`On-Grid systems synchronize with the utility and mainly reduce daytime grid consumption. They commonly operate without batteries. For anti-islanding safety, a normal grid-tied inverter stops supplying the site when the grid fails, even if the sun is shining. Export control, utility permission, meter type and grid voltage/frequency settings must match local requirements.`,
      ku:`سیستەمی On-Grid لەگەڵ تۆڕ sync دەبێت و سەرەکی بۆ کەمکردنەوەی بەکارهێنانی تۆڕ لە ڕۆژدایە؛ زۆرجار بێ باترییە. بۆ پاراستنی anti-islanding، کاتێک تۆڕ دەپچڕێت ئینڤێرتەری ئاسایی on-grid وەستێت، تەنانەت ئەگەر خۆریش هەبێت. export control، ڕێپێدان، جۆری میتەر و setting ـی voltage/frequency دەبێت لەگەڵ یاسای ناوخۆ بگونجێت.`,
      ar:`يتزامن نظام On-Grid مع الشبكة ويخفض الاستهلاك منها نهاراً، وغالباً بلا بطارية. لأمان منع التشغيل المنعزل يتوقف العاكس الشبكي الاعتيادي عند انقطاع الشبكة حتى مع وجود الشمس. يجب أن تتوافق حدود التصدير والموافقة ونوع العداد وإعدادات الجهد والتردد مع المتطلبات المحلية.`
    },
    {
      keys:['off-grid','off grid','offgrid','ئۆف گرید','ئۆفگرید','اوف گريد','خارج الشبكة'],
      en:`Off-Grid systems operate independently of the utility using panels, batteries and an off-grid/hybrid inverter; a generator may be added. Reliable design must cover daily energy, worst-season solar conditions, battery autonomy, surge loads and generator charging. Load management is crucial: heating, large air conditioners and pumps can quickly exhaust batteries if not planned.`,
      ku:`سیستەمی Off-Grid بە پانێڵ، باتری و ئینڤێرتەری off-grid/hybrid سەربەخۆ لە تۆڕ کار دەکات و دەتوانرێت جەنەریتەریش زیاد بکرێت. دیزاینی جێگیر دەبێت وزەی ڕۆژانە، خراپترین وەرزی خۆر، کاتژمێری باتری، بارە دەستپێکەکان و شارجی جەنەریتەر لەبەرچاو بگرێت. بەڕێوەبردنی بار زۆر گرنگە؛ گەرمکەرەوە، سپلیتی گەورە و پەمپ دەتوانن باتری زوو بەتاڵ بکەن.`,
      ar:`يعمل Off-Grid مستقلاً عن الشبكة بالألواح والبطاريات وعاكس مستقل أو هجين، ويمكن إضافة مولد. يجب أن يغطي التصميم الطاقة اليومية وأسوأ موسم شمسي ومدة البطارية وأحمال البدء وشحن المولد. إدارة الأحمال مهمة جداً؛ فالتدفئة والمكيفات الكبيرة والمضخات قد تستنزف البطاريات سريعاً.`
    },
    {
      keys:['hybrid','هایبرید','هايبرد','هجين'],
      en:`A Hybrid system coordinates solar, battery and grid and may also support a generator. It can prioritize solar, charge/discharge the battery by schedule, limit grid use and supply selected backup loads during outages. The essential-load output has a finite kW and surge rating, so critical loads should be separated from large nonessential loads. Correct CT/meter direction and safe changeover arrangements are important.`,
      ku:`سیستەمی Hybrid خۆر، باتری و تۆڕ بەیەکەوە بەڕێوە دەبات و هەندێک مۆدێل جەنەریتەریش پشتگیری دەکەن. دەتوانێت خۆر بخاتە پێشەوە، باتری بە کات شارج/دیسچارج بکات، بەکارهێنانی تۆڕ سنووردار بکات و لە پچڕاندا بارە گرنگەکان بەردەوام بکات. backup output سنووری kW و surge هەیە؛ بارە گرنگەکان لە بارە گەورە ناگرنگەکان جیا بکەرەوە. ئاراستەی CT/meter و changeover ـی پارێزراو گرنگن.`,
      ar:`يدير النظام Hybrid الطاقة الشمسية والبطارية والشبكة، وقد يدعم المولد. يمكنه إعطاء أولوية للشمس وجدولة شحن البطارية وتفريغها وتقليل استخدام الشبكة وتشغيل أحمال مختارة عند الانقطاع. لخرج الأحمال الاحتياطية حد kW وتحمل لحظي، لذلك تُفصل الأحمال الضرورية عن الكبيرة غير الضرورية. اتجاه CT/العداد والتحويل الآمن مهمان.`
    },
    {
      keys:['single phase','three phase','3 phase','3ph','یەک فەیز','سێ فەیز','فاز','طور واحد','ثلاثة أطوار','ثلاث فاز'],
      en:`Single-phase is common for smaller homes and shops; three-phase is used where the supply or major loads are three-phase. A three-phase system requires correct phase sequence, voltage checks and load balancing. Some backup inverters have limits on imbalance between phases. The inverter phase type must match the site and important three-phase motors need a proper starting-current assessment.`,
      ku:`یەک فەیز زۆرجار بۆ ماڵ و دوکانی بچووکە؛ سێ فەیز بۆ شوێن یان بارێکە کە سێ فەیزە. سیستەمی سێ فەیز پێویستی بە phase sequence، پشکنینی ڤۆڵتاژ و balance ـی بار هەیە. هەندێک ئینڤێرتەر سنووری جیاوازی بار لەنێوان فەیزەکان هەیە. جۆری فەیزی ئینڤێرتەر دەبێت لەگەڵ شوێن بگونجێت و ماتۆڕی سێ فەیز پێویستی بە حیسابی starting current هەیە.`,
      ar:`الطور الواحد شائع للمنازل والمحلات الأصغر، والثلاثي للمواقع أو الأحمال ثلاثية الطور. يحتاج النظام الثلاثي إلى تسلسل أطوار صحيح وفحص الجهد وموازنة الأحمال، وبعض عواكس الاحتياط تحد فرق الحمل بين الأطوار. يجب أن يطابق نوع العاكس الموقع، وأن يُحسب تيار بدء المحركات الثلاثية المهمة.`
    },
    {
      keys:['save','saving','bill','economy','grid price','پاشەکەوت','پارە','پسولە','بەکارهێنان','توفير','فاتورة','استهلاك'],
      en:`Solar savings depend on energy actually used or credited—not only installed kW. Estimate annual useful solar kWh, then multiply self-consumed energy by the avoided electricity rate and exported energy by any approved export credit. Subtract maintenance and expected component replacement. Self-consumption is usually improved by moving flexible loads to sunny hours. A trustworthy proposal should show assumptions, expected monthly/annual energy and a range rather than a guaranteed percentage.`,
      ku:`پاشەکەوتی سۆلەر بە وزەی بەڕاستی بەکارهاتوو یان credit کراو پەیوەستە، نەک تەنها kW ـی دانراو. kWh ـی ساڵانەی بەسوود بخەمڵێنە، بەشی خۆبەکارهێنراو بە نرخی کارەبای نەکڕاو لێکبدە و ئەگەر export credit هەیە بەشی نێردراو بەو نرخە. خەرجی چاودێری و گۆڕینی داهاتووی ئامێر لێکەم بکە. گواستنەوەی بارە flexible ـەکان بۆ کاتی خۆر self-consumption زیاد دەکات. پێشنیاری باوەڕپێکراو گریمانە، بەرهەمی مانگانە/ساڵانە و مەودای ئەنجام پیشان دەدات، نەک بەڵێنی ڕێژەیەکی حەتمی.`,
      ar:`يعتمد التوفير على الطاقة المستخدمة فعلياً أو المحتسبة، لا على kW المركبة فقط. تُقدّر kWh الشمسية السنوية المفيدة، ثم تضرب الطاقة المستهلكة مباشرة بسعر الكهرباء المتجنبة والطاقة المصدرة بسعر الاعتماد إن وجد، مع طرح الصيانة والاستبدالات المتوقعة. نقل الأحمال المرنة إلى ساعات الشمس يرفع الاستهلاك الذاتي. العرض الموثوق يوضح الافتراضات والطاقة الشهرية والسنوية كنطاق لا كنسبة مضمونة.`
    },
    {
      keys:['safety','fire','shock','danger','پاراستن','مەترسی','ئاگر','کارەباگرتن','سلامة','خطر','حريق','صعقة'],
      en:`Solar safety\n• PV cables can remain live whenever light reaches the panels, even when the AC breaker is off.\n• Never disconnect DC plugs under load, mix incompatible connector brands, bypass protection or open batteries/inverters without authorization.\n• Keep equipment dry, ventilated, labelled and inaccessible to children.\n• If you smell burning, see smoke, water entry, melted cable or repeated trips, keep away, isolate only if safely possible and call qualified technical support/emergency services.`,
      ku:`پاراستنی سۆلەر\n• کێبڵی PV هەر کات ڕووناکی بگاتە پانێڵ دەتوانێت زیندوو بێت، تەنانەت ئەگەر AC breaker داخراو بێت.\n• connector ـی DC لەژێر باردا مەکەرەوە، براندی connector تێکەڵ مەکە، پاراستن bypass مەکە و بێ ڕێپێدان باتری/ئینڤێرتەر مەکەرەوە.\n• ئامێر وشک، هەوادار، ناونیشان‌کراو و لەدەست منداڵ دوور بێت.\n• ئەگەر بۆنی سووتان، دووکەڵ، چوونەژوورەوەی ئاو، تواناوەی کێبڵ یان پەڕینی دووبارە ببینیت، دووربکەوە؛ تەنها ئەگەر پارێزراوە isolate بکە و پەیوەندی بە تەکنیک/فریاکەوتن بکە.`,
      ar:`سلامة النظام الشمسي\n• قد تبقى كابلات PV حية كلما وصل الضوء إلى الألواح حتى مع فصل قاطع AC.\n• لا تفصل موصل DC تحت الحمل، ولا تخلط موصلات غير متوافقة أو تتجاوز الحماية أو تفتح البطارية/العاكس بلا صلاحية.\n• أبق المعدات جافة ومهوّاة ومعلّمة وبعيدة عن الأطفال.\n• عند رائحة احتراق أو دخان أو دخول ماء أو كابل منصهر أو فصل متكرر، ابتعد وافصل فقط إن كان آمناً واتصل بفني مؤهل أو الطوارئ.`
    },
    {
      keys:['warranty','guarantee','گەرەنتی','ضمان','كفالة'],
      en:`A complete warranty review separates product warranty, performance warranty and installation/workmanship warranty. Keep the invoice, serial numbers, commissioning report, photos and monitoring records. Warranty can be affected by incorrect installation, unauthorized opening, incompatible settings, overvoltage, water entry or missing maintenance. The written manufacturer and seller terms—not a general marketing number—define coverage, exclusions, transport and service responsibility.`,
      ku:`لە گەرەنتیدا product warranty، performance warranty و گەرەنتی دامەزراندن لە یەک جیا بکەرەوە. پسولە، serial number، commissioning report، وێنە و داتای مۆنیتەرینگ هەڵبگرە. دامەزراندنی هەڵە، کردنەوەی بێ ڕێپێدان، setting ـی ناگونجاو، overvoltage، ئاو و نەکردنی چاودێری دەتوانێت کاریگەری لە گەرەنتی بکات. مەرجی نووسراوی بەرهەمهێنەر و فرۆشیار coverage، exclusion، گواستنەوە و بەرپرسیارێتی خزمەتگوزاری دیاری دەکات.`,
      ar:`يجب التفريق بين ضمان المنتج وضمان الأداء وضمان التركيب. احتفظ بالفاتورة والأرقام التسلسلية وتقرير التشغيل والصور وسجل المراقبة. قد يتأثر الضمان بالتركيب الخاطئ أو الفتح غير المصرح أو الإعداد غير المتوافق أو ارتفاع الجهد أو دخول الماء أو إهمال الصيانة. الشروط المكتوبة للشركة والبائع هي التي تحدد التغطية والاستثناءات والنقل والخدمة.`
    },
    {
      keys:['solar system','solar energy','how solar works','what is solar','سیستەمی سۆلەر','وزەی خۆر','سۆلەر چیە','الطاقة الشمسية','النظام الشمسي','كيف يعمل'],
      en:`A solar system converts sunlight into DC electricity in the panels. The inverter manages the DC power and supplies usable AC power; a hybrid system can also charge a battery and coordinate the grid or generator. A complete reliable system includes engineered panel strings, mounting, cables, DC/AC isolation and protection, earthing, monitoring and correct commissioning. Good design begins with measured loads and site conditions—not with equipment price alone.`,
      ku:`سیستەمی سۆلەر تیشکی خۆر لە پانێڵدا دەگۆڕێت بۆ کارەبای DC. ئینڤێرتەر DC بەڕێوە دەبات و کارەبای AC ـی بەکارهاتوو دابین دەکات؛ سیستەمی Hybrid دەتوانێت باتری شارج بکات و تۆڕ یان جەنەریتەر ڕێکبخات. سیستەمی جێگیر ستڕینگی ئەندازیاری، ستراکچەر، کێبڵ، عازل و پاراستنی DC/AC، ئەرث، مۆنیتەرینگ و commissioning ـی دروست لەخۆدەگرێت. دیزاینی باش بە پێوانەی بار و دۆخی شوێن دەست پێدەکات، نەک تەنها نرخ.`,
      ar:`يحوّل النظام الشمسي ضوء الشمس إلى كهرباء DC في الألواح. يدير العاكس طاقة DC ويوفر AC قابلة للاستخدام، ويمكن للنظام Hybrid شحن البطارية وتنظيم الشبكة أو المولد. يشمل النظام الموثوق سلاسل مصممة هندسياً وهيكلاً وكابلات وعزل وحماية DC/AC وتأريضاً ومراقبة وتشغيلاً صحيحاً. يبدأ التصميم الجيد من قياس الأحمال وظروف الموقع، لا من سعر المعدات وحده.`
    }
  ];

  topics.unshift(...[
    {
      keys:['longi vs power solid','longi and power solid','compare longi power solid','بەراوردی لۆنجی پاوەر سۆلید','لۆنجی و پاوەر سۆلید','مقارنة لونجي وباور سوليد','لونجي وباور سوليد'],
      en:`LONGi Hi-MO X10 offers the higher technical tier: 640-670W, up to 24.8% efficiency, back-contact cells, anti-dust design, 15-year product warranty and 30-year power warranty. Power Solid PS620W is a 620W N-type bifacial panel with 144 half-cells, strong mechanical-load ratings and a 15-year Alo warranty. LONGi is the premium choice for maximum efficiency and anti-dust performance; Power Solid is the balanced middle-quality option. Final selection also depends on string voltage, roof space and budget, which the assistant does not quote.`,
      ku:`LONGi Hi-MO X10 ئاستی تەکنیکی بەرزترە: 640-670W، کارایی تا 24.8%، back-contact، دیزاینی دژەخۆڵ، گەرەنتی بەرهەم 15 ساڵ و گەرەنتی هێز 30 ساڵ. Power Solid PS620W پانێڵێکی N-type bifacial ـی 620W ـە بە 144 half-cell، بەرگەگرتنی میکانیکی باش و گەرەنتی 15 ساڵی Alo. LONGi بۆ زۆرترین کارایی و دژەخۆڵ هەڵبژاردەی premium ـە؛ Power Solid هەڵبژاردەی ناوەندی هاوسەنگە. هەڵبژاردنی کۆتایی بە ستڕینگ، بۆشایی سەربان و بودجە پەیوەستە؛ AI نرخ ناڵێت.`,
      ar:`LONGi Hi-MO X10 هو المستوى التقني الأعلى: قدرة 640-670W وكفاءة حتى 24.8% وخلايا back-contact وتصميم مضاد للغبار وضمان منتج 15 سنة وقدرة 30 سنة. Power Solid PS620W لوح N-type ثنائي الوجه 620W مع 144 نصف خلية وتحمل ميكانيكي جيد وضمان Alo لمدة 15 سنة. LONGi خيار Premium للكفاءة ومقاومة الغبار، وPower Solid خيار متوسط متوازن. يعتمد القرار النهائي أيضاً على السلاسل ومساحة السطح والميزانية، والمساعد لا يعرض الأسعار.`
    },
    {
      keys:['pylontech vs hoymiles','pylontech hoymiles mana','compare pylontech hoymiles','پایلۆنتێک و هۆیمایلز','بەراوردی پایلۆنتێک هۆیمایلز','مقارنة بايلونتك وهويميلز','بايلونتك وهويميلز'],
      en:`Pylontech Fidus 16.076kWh is the premium battery option with 200A continuous current, IP65, 8000 cycles and a 10-year Alo warranty. Hoymiles LB-16D-G3 provides 16.08kWh, 314Ah, IP65, 8000 cycles and a 5-year Alo warranty, making it the middle-quality choice. EENOVANCE MANA-M is the flexible modular/basic range with several capacities from 5.1 to 20.5kWh and a 5-year Alo warranty. Confirm inverter protocol compatibility, continuous current and required backup hours before selecting.`,
      ku:`Pylontech Fidus 16.076kWh هەڵبژاردەی premium ـە بە 200A ئەمپێری بەردەوام، IP65، 8000 سایکڵ و گەرەنتی 10 ساڵی Alo. Hoymiles LB-16D-G3 بە 16.08kWh، 314Ah، IP65، 8000 سایکڵ و گەرەنتی 5 ساڵ هەڵبژاردەی کوالێتی ناوەندە. EENOVANCE MANA-M خێزانێکی modular و flexible ـە بە قەبارەی 5.1 تا 20.5kWh و گەرەنتی 5 ساڵ. پێش هەڵبژاردن گونجانی protocol، ئەمپێری بەردەوام و کاتژمێری پشتیوانی پشتڕاست بکەرەوە.`,
      ar:`Pylontech Fidus 16.076kWh هو الخيار Premium بتيار مستمر 200A وحماية IP65 وعمر 8000 دورة وضمان Alo لعشر سنوات. Hoymiles LB-16D-G3 يوفر 16.08kWh و314Ah وIP65 و8000 دورة وضمان خمس سنوات، وهو خيار الجودة المتوسطة. EENOVANCE MANA-M نطاق معياري مرن بسعات 5.1 إلى 20.5kWh وضمان خمس سنوات. يجب تأكيد بروتوكول العاكس والتيار المستمر وساعات الدعم قبل الاختيار.`
    },
    {
      keys:['deye vs medal power','deye vs bryyzee','compare deye medal','بەراوردی دیا میدڵ پاوەر','دیا و بریزی','مقارنة ديا وميدال باور','ديا وبريزي'],
      en:`Deye is Alo Solar Energy’s premium inverter range, offering single- and three-phase models, IP65 protection, advanced parallel and generator features, and a 5-year Alo warranty. Medal Power 6kW is a middle option with 9kW usable PV, IP54, up to 12 units in parallel and a 4-year warranty. Bryyzee 6.2kW is the basic option with a wide 60-500V MPPT range, IP21 and a 2-year warranty. Choose from actual phase, loads, starting surge, battery protocol and string design—not brand alone.`,
      ku:`Deye خێزانی premium ـی ئینڤێرتەری Alo Solar Energy ـە؛ مۆدێلی یەک و سێ فەیز، IP65، parallel و generator feature ـی پێشکەوتوو و گەرەنتی 5 ساڵ هەیە. Medal Power 6kW هەڵبژاردەی ناوەندە بە 9kW PV ـی بەکارهاتوو، IP54، تا 12 دانە parallel و گەرەنتی 4 ساڵ. Bryyzee 6.2kW هەڵبژاردەی ئاساییە بە MPPT ـی 60-500V، IP21 و گەرەنتی 2 ساڵ. هەڵبژاردن دەبێت بە فەیز، بار، starting surge، protocol ـی باتری و ستڕینگ بکرێت، نەک تەنها براند.`,
      ar:`Deye هو نطاق العواكس Premium لدى Alo Solar Energy، بموديلات أحادية وثلاثية وحماية IP65 وميزات متقدمة للتوازي والمولد وضمان خمس سنوات. Medal Power 6kW خيار متوسط مع PV قابلة للاستخدام 9kW وحماية IP54 وتوازي حتى 12 جهازاً وضمان أربع سنوات. Bryyzee 6.2kW خيار أساسي بمجال MPPT من 60 إلى 500V وحماية IP21 وضمان سنتين. الاختيار يعتمد على الطور والأحمال وتيار البدء وبروتوكول البطارية وتصميم السلاسل، لا على العلامة وحدها.`
    },
    {
      keys:['alo products','our products','product datasheet','بەرهەمەکانمان','بەرهەمی ئەلو','داتاشیتی بەرهەم','منتجات ألو','منتجاتنا','بيانات المنتجات'],
      en:`Alo Solar Energy uses selected solar panels, hybrid inverters and lithium batteries. The listed range includes LONGi Hi-MO X10 and Power Solid panels; Deye single- and three-phase hybrid inverters, Medal Power and Bryyzee inverters; and Pylontech, Hoymiles, EENOVANCE MANA-M and 3Watt batteries. Official datasheets can be opened from the Products page. Final selection depends on site loads, phase, PV string design and required backup time.`,
      ku:`Alo Solar Energy پانێڵ، ئینڤێرتەری Hybrid و باتری لیتیۆمی هەڵبژێردراو بەکاردەهێنێت. بەرهەمەکان LONGi Hi-MO X10 و Power Solid، ئینڤێرتەرەکانی Deye یەک فەیز و سێ فەیز، Medal Power و Bryyzee، و باترییەکانی Pylontech، Hoymiles، EENOVANCE MANA-M و 3Watt لەخۆدەگرن. داتاشیتی فەرمی لە پەڕەی بەرهەمەکان بەردەستە. هەڵبژاردنی کۆتایی بە بار، فەیز، دیزاینی ستڕینگ و ماوەی پشتیوانی پەیوەستە.`,
      ar:`تستخدم Alo Solar Energy ألواحاً وعواكس Hybrid وبطاريات ليثيوم مختارة. تشمل المنتجات ألواح LONGi Hi-MO X10 وPower Solid، وعواكس Deye أحادية وثلاثية الطور وMedal Power وBryyzee، وبطاريات Pylontech وHoymiles وEENOVANCE MANA-M و3Watt. تتوفر البيانات الرسمية في صفحة المنتجات، ويعتمد الاختيار النهائي على الأحمال والطور وتصميم السلاسل ومدة الدعم المطلوبة.`
    },
    {
      keys:['longi','hi-mo x10','himo x10','lr8-66hvdf','لۆنجی','لونجي'],
      en:`LONGi Hi-MO X10 Anti-Dust Pro (LR8-66HVDF) is a 640-670W back-contact, dual-glass panel with efficiency up to 24.8%, 132 cells, IP68 junction box, 32.6kg weight and 2382 × 1134mm dimensions. It has a 15-year product warranty and a 30-year linear power warranty. Its anti-dust edge design and coating are intended to reduce soiling and cleaning frequency.`,
      ku:`LONGi Hi-MO X10 Anti-Dust Pro، مۆدێلی LR8-66HVDF، پانێڵێکی 640-670W ـە بە تەکنەلۆژیای back-contact و dual-glass. کارایی تا 24.8%، 132 خانە، junction box ـی IP68، کێشی 32.6kg و قەبارەی 2382 × 1134mm هەیە. گەرەنتی بەرهەم 15 ساڵ و گەرەنتی هێزی linear ـی 30 ساڵە. دیزاین و coating ـی دژەخۆڵی بۆ کەمکردنەوەی کۆبوونەوەی خۆڵە.`,
      ar:`لوح LONGi Hi-MO X10 Anti-Dust Pro طراز LR8-66HVDF بقدرة 640-670W وتقنية back-contact وزجاج مزدوج. كفاءته حتى 24.8%، ويحتوي 132 خلية وعلبة توصيل IP68، ووزنه 32.6kg وأبعاده 2382 × 1134mm. ضمان المنتج 15 سنة وضمان القدرة الخطي 30 سنة، وتصميمه المضاد للغبار يساعد على تقليل الاتساخ.`
    },
    {
      keys:['power solid','ps620','ps620w','پاوەر سۆلید','باور سوليد'],
      en:`Power Solid PS620W#PVBN is a 620W N-type bifacial panel with 144 half-cells, dimensions of 2382 × 1134mm and weight of 33.5kg. The datasheet states 2400Pa wind and 5400Pa snow-load certification, weak-light performance and PID resistance. Alo Solar Energy lists a 15-year warranty for this panel.`,
      ku:`Power Solid PS620W#PVBN پانێڵێکی N-type bifacial ـی 620W ـە، 144 half-cell، قەبارەی 2382 × 1134mm و کێشی 33.5kg هەیە. داتاشیتەکە بەرگەگرتنی 2400Pa بۆ با و 5400Pa بۆ بەفر، کارکردنی باش لە ڕووناکی کەم و PID resistance باس دەکات. گەرەنتی لەلایەن Alo Solar Energy ـەوە 15 ساڵە.`,
      ar:`Power Solid PS620W#PVBN لوح N-type ثنائي الوجه بقدرة 620W و144 نصف خلية، أبعاده 2382 × 1134mm ووزنه 33.5kg. تذكر البيانات تحمّل رياح 2400Pa وثلوج 5400Pa وأداء جيداً في الإضاءة الضعيفة ومقاومة PID. ضمانه لدى Alo Solar Energy هو 15 سنة.`
    },
    {
      keys:['deye 3kw','deye 3.6kw','deye 4kw','deye 5kw','deye 6kw','sun-3k-sg06','sun-6k-sg06','دیا ٦','دیە ٦','ديا 6'],
      en:`The Deye SUN-3/3.6/4/4.6/5/6K-SG06LP1 range is single-phase hybrid. It uses a 40-60V battery system, accepts up to 500V PV, reaches 97.6% maximum efficiency, has IP65 protection and supports WiFi, RS485 and CAN. Alo Solar Energy warranty: 5 years.`,
      ku:`Deye SUN-3/3.6/4/4.6/5/6K-SG06LP1 ئینڤێرتەری Hybrid ـی یەک فەیزە. باتری 40-60V، زۆرترین PV voltage ـی 500V، کارایی تا 97.6%، پاراستنی IP65 و پەیوەندی WiFi، RS485 و CAN هەیە. گەرەنتی لەلایەن Alo Solar Energy ـەوە 5 ساڵە.`,
      ar:`سلسلة Deye SUN-3/3.6/4/4.6/5/6K-SG06LP1 عاكس Hybrid أحادي الطور، ببطارية 40-60V وحد PV أقصى 500V وكفاءة قصوى 97.6% وحماية IP65 واتصالات WiFi وRS485 وCAN. ضمان Alo Solar Energy: خمس سنوات.`
    },
    {
      keys:['deye 7kw','deye 7.6kw','deye 8kw','deye 10kw','deye 12kw single','sun-7k-sg05','sun-12k-sg02','دیا ٨','دیا ١٢ یەک فەیز','ديا 8','ديا 12 احادي'],
      en:`Deye single-phase hybrid options cover 7-10kW in the SUN-SG05LP1 family and 7.6-12kW in the SUN-SG02LP1 family. They use 40-60V batteries, accept up to 500V PV, reach 97.6% maximum efficiency, have IP65 protection and can support parallel operation according to the exact model. Alo Solar Energy warranty: 5 years.`,
      ku:`ئینڤێرتەرە Hybrid ـە یەک فەیزەکانی Deye، 7-10kW لە خێزانی SUN-SG05LP1 و 7.6-12kW لە SUN-SG02LP1 دەگرنەوە. باتری 40-60V، PV تا 500V، کارایی تا 97.6% و پاراستنی IP65 هەیە؛ parallel operation بە مۆدێلەکە پەیوەستە. گەرەنتی Alo Solar Energy: 5 ساڵ.`,
      ar:`خيارات Deye Hybrid الأحادية تشمل 7-10kW من عائلة SUN-SG05LP1 و7.6-12kW من SUN-SG02LP1. تعمل ببطاريات 40-60V وPV حتى 500V وكفاءة قصوى 97.6% وحماية IP65، ويعتمد التشغيل المتوازي على الموديل. ضمان Alo Solar Energy: خمس سنوات.`
    },
    {
      keys:['deye 14kw single','deye 16kw single','sun-14k-sg01','sun-16k-sg01','دیا ١٤','دیا ١٦ یەک فەیز','ديا 14 احادي','ديا 16 احادي'],
      en:`Deye SUN-12/14/16K-SG01LP1 is a high-power single-phase hybrid range with 40-60V batteries, three MPPT trackers, up to 97.6% maximum efficiency, IP65 protection and approximately 52kg weight. Alo Solar Energy warranty: 5 years.`,
      ku:`Deye SUN-12/14/16K-SG01LP1 خێزانێکی Hybrid ـی یەک فەیزی توانابەرزە؛ باتری 40-60V، سێ MPPT، کارایی تا 97.6%، پاراستنی IP65 و کێشی نزیکەی 52kg هەیە. گەرەنتی Alo Solar Energy: 5 ساڵ.`,
      ar:`Deye SUN-12/14/16K-SG01LP1 سلسلة Hybrid أحادية عالية القدرة، ببطاريات 40-60V وثلاثة MPPT وكفاءة قصوى 97.6% وحماية IP65 ووزن يقارب 52kg. ضمان Alo Solar Energy: خمس سنوات.`
    },
    {
      keys:['deye three phase','deye 3 phase','deye 20kw three phase','deye 12kw 3ph','deye 16kw 3ph','deye 20kw','sg05lp3','دیا سێ فەیز','دیا ٢٠ سێ فەیز','دیا ٢٠','ديا ثلاثي','ديا 20 ثلاثي','ديا 20'],
      en:`Deye three-phase hybrid ranges include SUN-3/4/5/6/8/10/12K-SG05LP3 and SUN-14/15/16/18/20K-SG05LP3. They use 40-60V batteries, accept PV input up to 800V, reach 97.6% maximum efficiency, have IP65 protection and support 100% unbalanced output. The 14-20kW family supports charge/discharge current up to 350A depending on model. Alo Solar Energy warranty: 5 years.`,
      ku:`Deye Hybrid ـی سێ فەیز خێزانەکانی SUN-3/4/5/6/8/10/12K-SG05LP3 و SUN-14/15/16/18/20K-SG05LP3 دەگرێتەوە. باتری 40-60V، PV تا 800V، کارایی تا 97.6%، IP65 و 100% unbalanced output هەیە. خێزانی 14-20kW بە پێی مۆدێل تا 350A charge/discharge پشتگیری دەکات. گەرەنتی Alo Solar Energy: 5 ساڵ.`,
      ar:`تشمل عواكس Deye Hybrid الثلاثية SUN-3/4/5/6/8/10/12K-SG05LP3 وSUN-14/15/16/18/20K-SG05LP3. تعمل ببطاريات 40-60V وتقبل PV حتى 800V وكفاءتها القصوى 97.6% وحمايتها IP65 وتدعم خرجاً غير متوازن 100%. عائلة 14-20kW تدعم تيار شحن وتفريغ حتى 350A حسب الموديل. الضمان خمس سنوات.`
    },
    {
      keys:['medal power','medald power','mphi-6kw','میدڵ پاوەر','ميدال باور'],
      en:`Medal Power MPHi-6KW#48VPVSE is a 6kW hybrid inverter for 40-60V batteries. It supports up to 9kW usable PV, maximum PV voltage of 500V, IP54 protection and up to 12 units in parallel. Alo Solar Energy warranty: 4 years.`,
      ku:`Medal Power MPHi-6KW#48VPVSE ئینڤێرتەرێکی Hybrid ـی 6kW ـە بۆ باتری 40-60V. تا 9kW PV ـی بەکارهاتوو، زۆرترین PV voltage ـی 500V، پاراستنی IP54 و تا 12 دانە parallel پشتگیری دەکات. گەرەنتی Alo Solar Energy: 4 ساڵ.`,
      ar:`Medal Power MPHi-6KW#48VPVSE عاكس Hybrid بقدرة 6kW لبطاريات 40-60V. يدعم PV قابلة للاستخدام حتى 9kW وجهد PV أقصى 500V وحماية IP54 وحتى 12 جهازاً بالتوازي. ضمان Alo Solar Energy: أربع سنوات.`
    },
    {
      keys:['bryyzee','brhi-6.2','بریزی','بريزي'],
      en:`Bryyzee BRHi-6.2KW#48VPVT is a 6.2kW hybrid inverter for a 48V battery. It has a 60-500V MPPT range, 500V maximum PV voltage, up to 98% stated DC/AC transfer efficiency and IP21 protection. Alo Solar Energy warranty: 2 years.`,
      ku:`Bryyzee BRHi-6.2KW#48VPVT ئینڤێرتەرێکی Hybrid ـی 6.2kW ـە بۆ باتری 48V. سنووری MPPT ـی 60-500V، زۆرترین PV voltage ـی 500V، کارایی DC/AC تا 98% و پاراستنی IP21 هەیە. گەرەنتی Alo Solar Energy: 2 ساڵ.`,
      ar:`Bryyzee BRHi-6.2KW#48VPVT عاكس Hybrid بقدرة 6.2kW لبطارية 48V، ومجال MPPT من 60 إلى 500V وجهد PV أقصى 500V وكفاءة تحويل DC/AC معلنة حتى 98% وحماية IP21. ضمان Alo Solar Energy: سنتان.`
    },
    {
      keys:['pylontech','fidus','fb-l-16','پایلۆنتێک','پایلۆن تێک','بايلونتك'],
      en:`Pylontech Fidus Battery Plus FB-L-16/FB-L-16-Pro is a 51.2V LiFePO4 battery with 16.076kWh nominal and usable capacity, 200A continuous charge/discharge current, 8000-cycle rating, IP65 enclosure and CAN/RS485 communication. Alo Solar Energy warranty: 10 years.`,
      ku:`Pylontech Fidus Battery Plus FB-L-16/FB-L-16-Pro باتری LiFePO4 ـی 51.2V ـە بە 16.076kWh قەبارەی ناوی و usable، ئەمپێری بەردەوامی charge/discharge ـی 200A، 8000 سایکڵ، IP65 و پەیوەندی CAN/RS485. گەرەنتی Alo Solar Energy: 10 ساڵ.`,
      ar:`Pylontech Fidus Battery Plus FB-L-16/FB-L-16-Pro بطارية LiFePO4 بجهد 51.2V وطاقة اسمية وقابلة للاستخدام 16.076kWh، وتيار شحن/تفريغ مستمر 200A، وعمر 8000 دورة وحماية IP65 واتصال CAN/RS485. ضمان Alo Solar Energy: عشر سنوات.`
    },
    {
      keys:['hoymiles battery','lb-16d-g3','hoymiles 16','هۆیمایلز','هويميلز'],
      en:`Hoymiles LB-16D-G3 is a 51.2V, 314Ah low-voltage lithium battery with 16.08kWh energy, 8000-cycle rating, IP65 enclosure, dimensions of 410 × 770 × 235mm and weight of about 110kg. Alo Solar Energy warranty: 5 years.`,
      ku:`Hoymiles LB-16D-G3 باتری لیتیۆمی low-voltage ـی 51.2V و 314Ah ـە بە 16.08kWh وزە، 8000 سایکڵ، IP65، قەبارەی 410 × 770 × 235mm و کێشی نزیکەی 110kg. گەرەنتی Alo Solar Energy: 5 ساڵ.`,
      ar:`Hoymiles LB-16D-G3 بطارية ليثيوم منخفضة الجهد 51.2V وسعة 314Ah وطاقة 16.08kWh، بعمر 8000 دورة وحماية IP65 وأبعاد 410 × 770 × 235mm ووزن نحو 110kg. ضمان Alo Solar Energy: خمس سنوات.`
    },
    {
      keys:['eenovance','mana-m','mana m','ئینۆڤانس','مانا','اينوفانس'],
      en:`EENOVANCE MANA-M is a modular residential LiFePO4 battery series with 5.1, 10.4, 16.0 and 20.5kWh capacity options. It is floor-standing and supports CAN/RS485 communication. The exact voltage, current and configuration must be confirmed from the selected model datasheet. Alo Solar Energy warranty: 5 years.`,
      ku:`EENOVANCE MANA-M خێزانێکی modular ـی باتری LiFePO4 ـی ماڵانەیە بە هەڵبژاردەی 5.1، 10.4، 16.0 و 20.5kWh. floor-standing ـە و CAN/RS485 پشتگیری دەکات. ڤۆڵتاژ، ئەمپێر و configuration ـی ورد بە مۆدێلی هەڵبژێردراو پەیوەستە. گەرەنتی Alo Solar Energy: 5 ساڵ.`,
      ar:`EENOVANCE MANA-M سلسلة بطاريات LiFePO4 منزلية معيارية بخيارات 5.1 و10.4 و16.0 و20.5kWh، بتصميم أرضي واتصال CAN/RS485. يجب تأكيد الجهد والتيار والتكوين من بيانات الموديل المحدد. ضمان Alo Solar Energy: خمس سنوات.`
    },
    {
      keys:['3watt','three watt','wt-5121000','سری وات','تری وات','ثري وات'],
      en:`3Watt WT-5121000-LT is a 51.2V, 100Ah LiFePO4 battery with 5.12kWh nominal energy, maximum 75A discharge current, maximum 50A charge current, at least 4000 cycles and approximate weight of 48kg. Alo Solar Energy warranty: 5 years.`,
      ku:`3Watt WT-5121000-LT باتری LiFePO4 ـی 51.2V و 100Ah ـە بە 5.12kWh وزە، زۆرترین discharge ـی 75A، زۆرترین charge ـی 50A، لانیکەم 4000 سایکڵ و کێشی نزیکەی 48kg. گەرەنتی Alo Solar Energy: 5 ساڵ.`,
      ar:`3Watt WT-5121000-LT بطارية LiFePO4 بجهد 51.2V وسعة 100Ah وطاقة 5.12kWh، وتيار تفريغ أقصى 75A وشحن أقصى 50A وعمر لا يقل عن 4000 دورة ووزن نحو 48kg. ضمان Alo Solar Energy: خمس سنوات.`
    }
  ]);

  const normalize = value => String(value || '').toLocaleLowerCase().replace(/[ـًٌٍَُِّْ]/g, '').replace(/\s+/g, ' ').trim();
  function answer(question, language) {
    const q = normalize(question);
    let best = null;
    for (const topic of topics) {
      const matches = topic.keys.filter(key => q.includes(normalize(key)));
      if (!matches.length) continue;
      const score = matches.length * 100 + Math.max(...matches.map(key => normalize(key).length));
      if (!best || score > best.score) best = { topic, score };
    }
    return best ? (best.topic[language] || best.topic.en) : '';
  }
  window.ALO_SOLAR_KNOWLEDGE = { topics, answer };
})();
